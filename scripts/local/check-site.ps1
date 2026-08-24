<#
.SYNOPSIS
    ローカルPCから本番サイトを外形監視する。

.DESCRIPTION
    サーバー内の monitor.sh とは役割が異なる。
    monitor.sh は監視対象のサーバー内部で動くため、サーバーごと落ちると無音になる。
    このスクリプトは外部（PC）から見るので、サーバー全体のダウンを検知できる。

    確認項目:
      1. https://mizuki-clinic.jp/ が 200 を返すか
      2. TLS証明書チェーンが有効で、残日数が閾値以上か
      3. /api/health が 200 を返すか
      4. www → non-www リダイレクトが機能しているか

    異常時のみメールを送る。連続通知を防ぐため、同種のアラートは
    既定1時間に1回までに抑制する（サーバー側 monitor.sh と同じ考え方）。

.NOTES
    メール送信の準備（初回のみ）:
      $p = Read-Host -AsSecureString "SMTPパスワード"
      $p | ConvertFrom-SecureString | Set-Content "$env:USERPROFILE\.mizuki-smtp.cred"

    DPAPI で暗号化されるため、同じWindowsユーザー・同じPCでしか復号できない。
    465番は .NET の SmtpClient が暗黙TLSに非対応のため 587（STARTTLS）を使う。
#>
[CmdletBinding()]
param(
    [string]$Url            = "https://mizuki-clinic.jp/",
    [string]$HealthUrl      = "https://mizuki-clinic.jp/api/health",
    [string]$WwwUrl         = "https://www.mizuki-clinic.jp/",
    [int]$CertWarnDays      = 20,
    [string]$MailTo         = "info@setaseisakusyo.com",
    [string]$MailFrom       = "info@setaseisakusyo.com",
    [string]$SmtpServer     = "mail1042.onamae.ne.jp",
    [int]$SmtpPort          = 587,
    [string]$CredentialFile = "$env:USERPROFILE\.mizuki-smtp.cred",
    [int]$AlertIntervalSec  = 3600,
    [switch]$TestAlert
)

$ErrorActionPreference = "Continue"

$stateDir = Join-Path $env:LOCALAPPDATA "mizuki-monitor"
$logFile  = Join-Path $stateDir "check-site.log"
if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory -Path $stateDir -Force | Out-Null }

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $line = "[{0}] {1} {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level, $Message
    Write-Output $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

# 同種のアラートを AlertIntervalSec に1回までに抑える
function Test-ShouldAlert {
    param([string]$Key)
    $stamp = Join-Path $stateDir "$Key.stamp"
    if (Test-Path $stamp) {
        $age = (New-TimeSpan -Start (Get-Item $stamp).LastWriteTime -End (Get-Date)).TotalSeconds
        if ($age -lt $AlertIntervalSec) { return $false }
    }
    Set-Content -Path $stamp -Value (Get-Date -Format o) -Encoding ascii
    return $true
}
function Clear-Alert {
    param([string]$Key)
    Remove-Item (Join-Path $stateDir "$Key.stamp") -ErrorAction SilentlyContinue
}

function Send-Alert {
    param([string]$Subject, [string]$Body)

    if (-not (Test-Path $CredentialFile)) {
        Write-Log "メール送信不可: 認証情報がありません ($CredentialFile)" "ERROR"
        Write-Log "  作成: `$p = Read-Host -AsSecureString 'SMTPパスワード'; `$p | ConvertFrom-SecureString | Set-Content '$CredentialFile'" "ERROR"
        return $false
    }

    try {
        $secure = Get-Content $CredentialFile | ConvertTo-SecureString
        $cred   = New-Object System.Management.Automation.PSCredential($MailFrom, $secure)

        $msg = New-Object System.Net.Mail.MailMessage
        $msg.From = $MailFrom
        $msg.To.Add($MailTo)
        $msg.Subject = "[ALERT] $Subject"
        $msg.Body = $Body
        $msg.BodyEncoding = [System.Text.Encoding]::UTF8
        $msg.SubjectEncoding = [System.Text.Encoding]::UTF8

        $smtp = New-Object System.Net.Mail.SmtpClient($SmtpServer, $SmtpPort)
        $smtp.EnableSsl = $true
        $smtp.Credentials = $cred.GetNetworkCredential()
        $smtp.Send($msg)
        $msg.Dispose()

        Write-Log "ALERT SENT: $Subject"
        return $true
    } catch {
        # 送信自体の失敗を握りつぶすと、監視が死んでいることに気づけない
        Write-Log "ALERT SEND FAILED: $Subject -- $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# HTTPステータスと証明書を1回の接続で取得する
function Get-SiteStatus {
    param([string]$TargetUrl)
    $result = [ordered]@{ Url = $TargetUrl; Ok = $false; Status = $null; Location = $null;
                          CertDays = $null; CertValid = $null; Error = $null }
    $req = [Net.HttpWebRequest]::Create($TargetUrl)
    $req.Timeout = 20000
    $req.AllowAutoRedirect = $false
    $req.UserAgent = "mizuki-monitor/1.0"
    try {
        $resp = $req.GetResponse()
        $result.Status = [int]$resp.StatusCode
        $result.Location = $resp.Headers['Location']
        $resp.Close()
        $result.Ok = $true
    } catch [Net.WebException] {
        if ($_.Exception.Response) {
            $result.Status = [int]$_.Exception.Response.StatusCode
            $result.Location = $_.Exception.Response.Headers['Location']
            $_.Exception.Response.Close()
            $result.Ok = $true   # 応答は返っている（4xx/5xxは後段で判定）
        } else {
            $result.Error = $_.Exception.Message
        }
    }
    try {
        $cert = $req.ServicePoint.Certificate
        if ($cert) {
            $c2 = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2($cert)
            $result.CertDays  = [int](New-TimeSpan -Start (Get-Date) -End $c2.NotAfter).TotalDays
            $result.CertValid = $c2.Verify()
        }
    } catch { }
    return $result
}

# ---- テスト送信 ----
if ($TestAlert) {
    Write-Log "テスト送信を実行します"
    $ok = Send-Alert "外形監視のテスト通知" "これは check-site.ps1 の疎通確認です。`n送信元PC: $env:COMPUTERNAME`n時刻: $(Get-Date)"
    exit $(if ($ok) { 0 } else { 1 })
}

$problems = @()

# ---- 1. トップページ ----
$main = Get-SiteStatus $Url
if ($main.Error) {
    $problems += @{ Key = "down"; Subject = "サイトに接続できません"; Detail = "URL: $Url`nエラー: $($main.Error)" }
} elseif ($main.Status -ne 200) {
    $problems += @{ Key = "status"; Subject = "サイトが異常なステータスを返しています ($($main.Status))"; Detail = "URL: $Url`nHTTP: $($main.Status)" }
} else {
    Clear-Alert "down"; Clear-Alert "status"
}

# ---- 2. 証明書 ----
if ($main.CertDays -ne $null) {
    if ($main.CertValid -ne $true) {
        $problems += @{ Key = "cert"; Subject = "SSL証明書のチェーン検証に失敗しています"; Detail = "URL: $Url`n残日数: $($main.CertDays)" }
    } elseif ($main.CertDays -lt $CertWarnDays) {
        $problems += @{ Key = "cert"; Subject = "SSL証明書の期限が迫っています (残 $($main.CertDays) 日)"; Detail = "URL: $Url`n残日数: $($main.CertDays)（閾値 $CertWarnDays 日）`n`nサーバーで確認:`n  tail -50 ~/mizuki-hp/certbot-renew.log" }
    } else {
        Clear-Alert "cert"
    }
}

# ---- 3. ヘルスチェック ----
$health = Get-SiteStatus $HealthUrl
if ($health.Error -or $health.Status -ne 200) {
    $d = if ($health.Error) { $health.Error } else { "HTTP $($health.Status)" }
    $problems += @{ Key = "health"; Subject = "アプリのヘルスチェックが失敗しています"; Detail = "URL: $HealthUrl`n結果: $d`n`nnginx は応答しているがアプリが不調な可能性があります。" }
} else {
    Clear-Alert "health"
}

# ---- 4. www リダイレクト ----
$www = Get-SiteStatus $WwwUrl
if ($www.Error) {
    $problems += @{ Key = "www"; Subject = "www ドメインに接続できません"; Detail = "URL: $WwwUrl`nエラー: $($www.Error)" }
} elseif ($www.Status -ne 301) {
    $problems += @{ Key = "www"; Subject = "www → non-www リダイレクトが機能していません"; Detail = "URL: $WwwUrl`nHTTP: $($www.Status)（301 が期待値）" }
} else {
    Clear-Alert "www"
}

# ---- 通知 ----
if ($problems.Count -eq 0) {
    Write-Log "正常 (HTTP $($main.Status) / 証明書残 $($main.CertDays) 日 / health $($health.Status) / www $($www.Status))"
    exit 0
}

foreach ($p in $problems) {
    Write-Log "異常検知: $($p.Subject)" "WARN"
    if (Test-ShouldAlert $p.Key) {
        $body = "$($p.Detail)`n`n検知時刻: $(Get-Date)`n監視元PC: $env:COMPUTERNAME`n`n" +
                "※ これはローカルPCからの外形監視です。サーバー内の monitor.sh とは独立しています。"
        Send-Alert $p.Subject $body | Out-Null
    } else {
        Write-Log "  （通知は抑制中: 前回から $AlertIntervalSec 秒以内）"
    }
}
exit 1

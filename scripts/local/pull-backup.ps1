<#
.SYNOPSIS
    本番サーバーのバックアップをローカルPCへ取得する（pull型オフサイト）。

.DESCRIPTION
    サーバーからPCへ「送る」のではなく、PCが「取りに行く」構成にしている。
    push型だとサーバーが侵害された際にバックアップ先まで消されるため。
    サーバー側はPCへの経路を一切持たない。

    取得対象:
      backups/*.sql.gz              DBダンプ（全件・数百KB）
      backups/haiku/*.tar.gz        俳句バックアップ（日次DBのみ＋週次uploads込み）
      backups/secrets/*.enc         暗号化した秘密情報
      uploads/                      画像本体（前回同期以降の差分のみ）

    uploads は削除を伝播させない（追記のみ）。サーバー上で誤削除しても
    PC側に残るため、単純なミラーより安全。

    PCに rsync が無いため、サーバー側で差分tarを作って scp で取得する。
    scp はバイナリ安全で、PowerShellのパイプによる破損を避けられる。

.PARAMETER Destination
    保存先ルート。既定 C:\backups\mizuki-hp

.PARAMETER SshHost
    ssh の接続先。既定 mizukiHP-main（~/.ssh/config のエントリ名）

.PARAMETER FullUploads
    差分ではなく uploads 全体を取得する。初回や整合性を疑う時に使う。

.EXAMPLE
    .\pull-backup.ps1
    .\pull-backup.ps1 -FullUploads
#>
[CmdletBinding()]
param(
    [string]$Destination = "C:\backups\mizuki-hp",
    [string]$SshHost     = "mizukiHP-main",
    [string]$RemoteDir   = "~/mizuki-hp",
    [string]$BashPath    = "C:\Program Files\Git\bin\bash.exe",
    [switch]$FullUploads
)

$ErrorActionPreference = "Stop"

$dbDir      = Join-Path $Destination "db"
$haikuDir   = Join-Path $Destination "haiku"
$secretsDir = Join-Path $Destination "secrets"
$uploadsDir = Join-Path $Destination "uploads"
$stateFile  = Join-Path $Destination "last-sync.txt"
$logFile    = Join-Path $Destination "pull-backup.log"

foreach ($d in @($Destination, $dbDir, $haikuDir, $secretsDir, $uploadsDir)) {
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null }
}

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $line = "[{0}] {1} {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level, $Message
    Write-Output $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

# Windows PowerShell 5.1 では、native コマンドに 2>&1 を付けると stderr の各行が
# ErrorRecord に変換され、ErrorActionPreference=Stop の下では終了コード0でも
# 例外になる。ssh は "Warning: Permanently added ... known hosts" を stderr に
# 出すため、2>&1 は使わず終了コードだけで判定する。
# -o LogLevel=ERROR でその警告自体も抑制する。
$SshOpts = @('-o','BatchMode=yes','-o','ConnectTimeout=30','-o','LogLevel=ERROR')

function Invoke-Ssh {
    param([string]$Command)
    $out = & ssh @SshOpts $SshHost $Command
    if ($LASTEXITCODE -ne 0) {
        throw "ssh failed (exit $LASTEXITCODE)"
    }
    return $out
}

# 前回中断した .part の残骸を掃除する
Get-ChildItem $Destination -Recurse -File -Filter "*.part" -ErrorAction SilentlyContinue |
    ForEach-Object { Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue }

Write-Log "=== バックアップ取得開始 ==="

try {
    # 疎通確認。ここで落ちるなら以降は無意味なので早期に失敗させる
    Invoke-Ssh "test -d $RemoteDir" | Out-Null
} catch {
    Write-Log "サーバーに接続できません: $_" "ERROR"
    exit 1
}

# ---- 1. DBダンプ・俳句・秘密情報 ----
# ファイル名に日時が入っており内容は不変なので、ローカルに無いものだけ取得する。
# 毎回まるごと取り直すと、週次のuploads込みアーカイブ(336MB x 4世代)を
# 日々再転送することになる。
foreach ($item in @(
    @{ Remote = "$RemoteDir/backups/*.sql.gz";       Local = $dbDir;      Name = "DBダンプ" },
    @{ Remote = "$RemoteDir/backups/haiku/*.tar.gz"; Local = $haikuDir;   Name = "俳句バックアップ" },
    @{ Remote = "$RemoteDir/backups/secrets/*.enc";  Local = $secretsDir; Name = "秘密情報(暗号化)" }
)) {
    $remoteList = @(Invoke-Ssh "ls -1 $($item.Remote) 2>/dev/null || true" |
                    Where-Object { $_ -and $_.Trim() })
    if ($remoteList.Count -eq 0) {
        Write-Log "$($item.Name): サーバー側に対象なし（スキップ）" "WARN"
        continue
    }

    $fetched = 0
    foreach ($remoteFile in $remoteList) {
        $name = ($remoteFile.Trim() -split '/')[-1]
        $localPath = Join-Path $item.Local $name
        if (Test-Path $localPath) { continue }   # 既にあるものは再取得しない

        # 一旦 .part に落として成功時のみリネームする。
        # 直接書くと、転送が途中で切れた場合に次回 Test-Path が真になり
        # 「取得済み」と誤認して壊れたファイルが残り続ける。
        $partPath = "$localPath.part"
        Remove-Item $partPath -ErrorAction SilentlyContinue
        & scp -q @SshOpts "${SshHost}:$($remoteFile.Trim())" $partPath
        if ($LASTEXITCODE -ne 0) {
            Write-Log "$($item.Name): $name の取得に失敗" "ERROR"
            Remove-Item $partPath -ErrorAction SilentlyContinue
            exit 1
        }
        Move-Item -Force $partPath $localPath
        $fetched++
    }

    $n = (Get-ChildItem $item.Local -File).Count
    Write-Log "$($item.Name): 新規 $fetched 件を取得（ローカル計 $n 件 / サーバー $($remoteList.Count) 件）"
}

# ---- 2. uploads（差分） ----
$sinceArg = ""
$mode = "全件"
if (-not $FullUploads -and (Test-Path $stateFile)) {
    $lastSync = (Get-Content $stateFile -Raw).Trim()
    if ($lastSync) {
        $sinceArg = "--newer-mtime='$lastSync'"
        $mode = "差分（$lastSync 以降）"
    }
}
Write-Log "uploads 取得開始（$mode）"

# 今回の基準時刻は転送「前」に決める。転送中に追加されたファイルを取りこぼさないため
$syncStamp = (Get-Date).ToUniversalTime().AddMinutes(-5).ToString("yyyy-MM-dd HH:mm:ss")

$remoteTar = "/tmp/mizuki-uploads-inc.tar.gz"
$localTar  = Join-Path $env:TEMP "mizuki-uploads-inc.tar.gz"

try {
    # 対象が0件でも tar は空アーカイブを作るので、後段はそのまま動く
    Invoke-Ssh "cd $RemoteDir && tar czf $remoteTar $sinceArg uploads 2>/dev/null || true" | Out-Null

    & scp -q @SshOpts "${SshHost}:$remoteTar" $localTar
    if ($LASTEXITCODE -ne 0) { throw "scp failed" }

    $sizeMB = [math]::Round((Get-Item $localTar).Length / 1MB, 1)

    # Windows 同梱の tar.exe (bsdtar) は現在のコードページでファイル名を解釈するため、
    # UTF-8 の日本語ファイル名が
    #   "Invalid empty pathname: Unknown error"
    # で展開に失敗する。Git Bash の GNU tar はバイト列のまま扱うので問題ない。
    # (uploads には日本語名のアップロード画像が含まれる)
    if (-not (Test-Path $BashPath)) {
        throw "Git Bash が見つかりません: $BashPath`n" +
              "Windows の tar.exe は日本語ファイル名を展開できないため必須です。"
    }
    $sep   = [string][char]92
    $srcU  = $localTar.Replace($sep, '/').Replace('C:', '/c')
    $destU = $Destination.Replace($sep, '/').Replace('C:', '/c')
    & $BashPath -c "tar -xzf '$srcU' -C '$destU'"
    if ($LASTEXITCODE -ne 0) { throw "tar 展開に失敗 (exit $LASTEXITCODE)" }

    $fileCount = (Get-ChildItem $uploadsDir -Recurse -File).Count
    Write-Log "uploads 取得完了（転送 ${sizeMB}MB / ローカル計 $fileCount ファイル）"

    Set-Content -Path $stateFile -Value $syncStamp -Encoding ascii
} finally {
    Remove-Item $localTar -ErrorAction SilentlyContinue
    & ssh @SshOpts $SshHost "rm -f $remoteTar" | Out-Null
}

# ---- 3. 結果サマリ ----
$totalMB = [math]::Round(((Get-ChildItem $Destination -Recurse -File | Measure-Object Length -Sum).Sum) / 1MB, 1)
Write-Log "=== 完了 / 保存先 $Destination（合計 ${totalMB}MB）==="

# ローカルPC側の運用スクリプト

サーバー内では完結しない役割を、ローカルPCが担う。

| スクリプト | 役割 | 実行間隔 |
|---|---|---|
| `pull-backup.ps1` | 本番バックアップをPCへ取得（オフサイト） | 日次 |
| `check-site.ps1` | サーバー外部からの死活・証明書監視 | 30分 |

## なぜPC側で動かすのか

**バックアップ**: サーバー上のバックアップは、守る対象と同じディスクに置かれている。
サーバーを失えばバックアップごと失う。PCに複製することで保管場所が2箇所になる。

**pull型にしている理由**: サーバーからPCへ「送る」構成にすると、サーバーが侵害された際に
バックアップ先まで消される。PCが「取りに行く」ならサーバーはPCへの経路を持たない。

**監視**: サーバー内の `monitor.sh` は監視対象の内部で動くため、サーバーごと落ちると
何も通知されない。PCから見れば、サーバー全体のダウンを検知できる。

---

## 前提

| 項目 | 確認方法 |
|---|---|
| SSH設定 | `ssh mizukiHP-main` で本番へ接続できること |
| PowerShell | Windows PowerShell 5.1 以降 |
| tar | Windows 10 1803 以降に標準搭載（`tar --version`） |

rsync は不要（PCに無いため、`ssh` + `tar` + `scp` で差分転送する）。

---

## 1. バックアップ取得の設定

```powershell
# 初回は uploads を全件取得する（約336MB、5〜10分）
.\scripts\local\pull-backup.ps1

# 2回目以降は前回同期以降の差分のみ
.\scripts\local\pull-backup.ps1

# 整合性を疑う場合は全件取り直し
.\scripts\local\pull-backup.ps1 -FullUploads
```

保存先: `C:\backups\mizuki-hp\{db,haiku,secrets,uploads}\`

**uploads は削除を伝播させない**（追記のみ）。サーバー上で誤削除してもPC側に残る。

### タスクスケジューラに登録（日次 5:00）

管理者権限のPowerShellで実行:

```powershell
$repo = "C:\Users\setas\mizuki-hp"
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$repo\scripts\local\pull-backup.ps1`""
$trigger = New-ScheduledTaskTrigger -Daily -At 5:00AM
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
    -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2)
Register-ScheduledTask -TaskName "mizuki-hp-backup-pull" `
    -Action $action -Trigger $trigger -Settings $settings `
    -Description "本番バックアップをローカルPCへ取得"
```

`-StartWhenAvailable` により、PC停止中に実行時刻を過ぎた場合は起動後に追いつく。

---

## 2. 外形監視の設定

### メール送信の準備（初回のみ）

```powershell
$p = Read-Host -AsSecureString "SMTPパスワード"
$p | ConvertFrom-SecureString | Set-Content "$env:USERPROFILE\.mizuki-smtp.cred"
```

DPAPI で暗号化されるため、**同じWindowsユーザー・同じPCでしか復号できない**。
ファイルを他所へコピーしても使えない。

> 465番ではなく 587番（STARTTLS）を使う。.NET の `SmtpClient` は
> 暗黙TLS（465）に対応していないため。

### 疎通確認

```powershell
.\scripts\local\check-site.ps1 -TestAlert     # テストメールを送る
.\scripts\local\check-site.ps1                # 通常チェック（正常なら何も送らない）
```

### タスクスケジューラに登録（30分ごと）

```powershell
$repo = "C:\Users\setas\mizuki-hp"
$action  = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$repo\scripts\local\check-site.ps1`""
$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) `
    -RepetitionInterval (New-TimeSpan -Minutes 30)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
    -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 10)
Register-ScheduledTask -TaskName "mizuki-hp-site-check" `
    -Action $action -Trigger $trigger -Settings $settings `
    -Description "本番サイトの外形監視"
```

---

## ログ

| 内容 | 場所 |
|---|---|
| バックアップ取得 | `C:\backups\mizuki-hp\pull-backup.log` |
| 外形監視 | `%LOCALAPPDATA%\mizuki-monitor\check-site.log` |
| 通知抑制の状態 | `%LOCALAPPDATA%\mizuki-monitor\*.stamp` |

同種のアラートは既定1時間に1回まで。復旧するとスタンプが消え、再度通知できる状態に戻る。

---

## 実装上の注意（PowerShell 5.1）

将来スクリプトを触る際に踏みやすい点。

**1. native コマンドに `2>&1` を付けない**

`ssh` や `scp` の stderr を `2>&1` でリダイレクトすると、各行が ErrorRecord に変換され、
`$ErrorActionPreference = "Stop"` の下では**終了コード0でも例外になる**。
`ssh` は "Warning: Permanently added ... known hosts" を stderr に出すため、これに必ず当たる。
終了コード（`$LASTEXITCODE`）だけで判定し、警告自体は `-o LogLevel=ERROR` で抑える。

**2. `.ps1` は UTF-8 BOM 付きで保存する**

Windows PowerShell 5.1 は BOM が無い UTF-8 を ANSI として読むため、
日本語のコメントや文字列が壊れて構文エラーになる。

**3. バイナリをPowerShellのパイプに通さない**

`ssh host "tar czf -" | tar xzf -` はパイプがテキスト扱いのためデータが壊れる。
サーバー側で一旦ファイルに書き、`scp`（バイナリ安全）で取得する。

**4. `&&` `||` `??` は使えない**

5.1 では未対応。`if` で書く。

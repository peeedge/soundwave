[CmdletBinding()]
param(
    [ValidateSet("start", "stop", "restart", "status")]
    [string]$Command = "start"
)

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
$RuntimeDirectory = Join-Path $Root ".runtime"
$PidFile = Join-Path $RuntimeDirectory "dev-server.pid"
$OutputLog = Join-Path $RuntimeDirectory "dev-server.log"
$ErrorLog = Join-Path $RuntimeDirectory "dev-server.error.log"
$ViteScript = Join-Path $Root "node_modules\vite\bin\vite.js"
$Url = "http://127.0.0.1:5173"

function Get-ServerProcess {
    if (-not (Test-Path $PidFile)) {
        return $null
    }

    $serverPid = Get-Content $PidFile -ErrorAction SilentlyContinue
    if (-not $serverPid) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    $serverProcess = Get-Process -Id $serverPid -ErrorAction SilentlyContinue
    if (-not $serverProcess) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        return $null
    }

    return $serverProcess
}

function Start-Server {
    $serverProcess = Get-ServerProcess
    if ($serverProcess) {
        Write-Host "Soundwave is already running (PID $($serverProcess.Id)) at $Url"
        return
    }

    if (-not (Test-Path $ViteScript)) {
        Write-Host "Installing dependencies..."
        Push-Location $Root
        try {
            & npm.cmd install
            if ($LASTEXITCODE -ne 0) {
                throw "npm install failed with exit code $LASTEXITCODE."
            }
        }
        finally {
            Pop-Location
        }
    }

    New-Item -ItemType Directory -Path $RuntimeDirectory -Force | Out-Null
    $serverProcess = Start-Process `
        -FilePath "node.exe" `
        -ArgumentList "`"$ViteScript`"", "--host", "127.0.0.1", "--port", "5173" `
        -WorkingDirectory $Root `
        -RedirectStandardOutput $OutputLog `
        -RedirectStandardError $ErrorLog `
        -WindowStyle Hidden `
        -PassThru

    Set-Content -Path $PidFile -Value $serverProcess.Id
    Start-Sleep -Milliseconds 700

    if ($serverProcess.HasExited) {
        Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
        $details = Get-Content $ErrorLog -Raw -ErrorAction SilentlyContinue
        throw "Soundwave failed to start. $details"
    }

    Write-Host "Soundwave started (PID $($serverProcess.Id)) at $Url"
}

function Stop-Server {
    $serverProcess = Get-ServerProcess
    if (-not $serverProcess) {
        Write-Host "Soundwave is not running."
        return
    }

    Stop-Process -Id $serverProcess.Id
    try {
        Wait-Process -Id $serverProcess.Id -Timeout 5 -ErrorAction Stop
    }
    catch {
        Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    }

    Remove-Item $PidFile -Force -ErrorAction SilentlyContinue
    Write-Host "Soundwave stopped."
}

switch ($Command) {
    "start" { Start-Server }
    "stop" { Stop-Server }
    "restart" {
        Stop-Server
        Start-Server
    }
    "status" {
        $serverProcess = Get-ServerProcess
        if ($serverProcess) {
            Write-Host "Soundwave is running (PID $($serverProcess.Id)) at $Url"
        }
        else {
            Write-Host "Soundwave is not running."
        }
    }
}

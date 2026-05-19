# Publish wiki/ folder to GitHub Wiki repository
# Usage: .\scripts\push-wiki.ps1
# Requires: Wiki enabled in repo Settings -> Features -> Wikis

$ErrorActionPreference = "Stop"
$Repo = "ismaiidogan/TestLab-29119"
$WikiUrl = "https://github.com/$Repo.wiki.git"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$WikiSrc = Join-Path $Root "wiki"
$TempDir = Join-Path $env:TEMP "TestLab-29119-wiki-push"

if (-not (Test-Path $WikiSrc)) {
    Write-Error "wiki/ folder not found at $WikiSrc"
}

Write-Host "Cloning wiki repository..."
if (Test-Path $TempDir) { Remove-Item -Recurse -Force $TempDir }
$prevEap = $ErrorActionPreference
$ErrorActionPreference = "Continue"
git clone $WikiUrl $TempDir 2>&1 | Out-Host
$cloneOk = $LASTEXITCODE -eq 0
$ErrorActionPreference = $prevEap
if (-not $cloneOk) {
    Write-Host ""
    Write-Host "Failed to clone wiki. Ensure:"
    Write-Host "  1. Wikis are enabled: https://github.com/$Repo/settings"
    Write-Host "  2. You are authenticated for git push"
    Write-Host "  3. Create the first wiki page on GitHub if the wiki repo does not exist yet"
    exit 1
}

Write-Host "Copying wiki source files..."
Get-ChildItem $TempDir -Force | Where-Object { $_.Name -ne ".git" } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item -Path (Join-Path $WikiSrc "*") -Destination $TempDir -Force

Push-Location $TempDir
git add -A
$status = git status --porcelain
if (-not $status) {
    Write-Host "No changes to publish."
    Pop-Location
    exit 0
}

$env:GIT_AUTHOR_NAME = "ismaiidogan"
$env:GIT_AUTHOR_EMAIL = "ismaiidogan@users.noreply.github.com"
$env:GIT_COMMITTER_NAME = "ismaiidogan"
$env:GIT_COMMITTER_EMAIL = "ismaiidogan@users.noreply.github.com"

git commit -m "Update wiki documentation from wiki/ source"
git push origin master 2>&1 | Out-Host
if ($LASTEXITCODE -ne 0) {
    git push origin main 2>&1 | Out-Host
}
Pop-Location

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Wiki published: https://github.com/$Repo/wiki"
} else {
    Write-Error "git push failed"
}

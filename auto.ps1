# powershell -ExecutionPolicy Bypass -File auto-git.ps1
while ($true) {
    try {
        Write-Host "[$(Get-Date)] Running Git Sync..."

        git add .

        git diff --cached --quiet
        if ($LASTEXITCODE -eq 0) {
            Write-Host "No changes to commit."
        }
        else {
            git commit -m "changes"
            git push
        }
    }
    catch {
        Write-Host "Error: $_"
    }

    Write-Host "Waiting 15 minutes..."
    Start-Sleep -Seconds 900
}
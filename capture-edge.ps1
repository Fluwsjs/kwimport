# Kill all Chrome and game processes
Get-Process | Where-Object {$_.ProcessName -like "*chrome*" -or $_.ProcessName -like "*runelite*" -or $_.ProcessName -like "*jagex*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Use Selenium-like approach with PowerShell
# Install Selenium if not available, or use Edge WebDriver

$url = "https://www.gijsautoimport.nl/"

# Try using Microsoft Edge in app mode (kiosk-like)
$edgeArgs = @(
    "--start-fullscreen",
    "--new-window", 
    $url
)

Write-Host "Opening $url in Edge..."
Start-Process "msedge.exe" -ArgumentList $edgeArgs

# Wait for page load
Start-Sleep -Seconds 8

# Load screenshot assemblies
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Function to capture
function Take-Screenshot {
    param([string]$name)
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bmp = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $path = Join-Path $PSScriptRoot $name
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Saved: $name"
}

# Take screenshots
Take-Screenshot "website-1-hero.png"
Start-Sleep -Seconds 2

# Simulate scrolling
[System.Windows.Forms.SendKeys]::SendWait("{PGDN}")
Start-Sleep -Seconds 2
Take-Screenshot "website-2-content.png"

[System.Windows.Forms.SendKeys]::SendWait("{PGDN}")
Start-Sleep -Seconds 2
Take-Screenshot "website-3-middle.png"

[System.Windows.Forms.SendKeys]::SendWait("{PGDN}")
Start-Sleep -Seconds 2
Take-Screenshot "website-4-lower.png"

[System.Windows.Forms.SendKeys]::SendWait("{PGDN}")
Start-Sleep -Seconds 2
Take-Screenshot "website-5-footer.png"

Write-Host "Complete!"

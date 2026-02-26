# Wait for processes to fully close
Start-Sleep -Seconds 3

# Load assemblies
Add-Type -AssemblyName System.Windows.Forms  
Add-Type -AssemblyName System.Drawing

# Open Chrome maximized
$url = "https://www.gijsautoimport.nl/"
Start-Process "chrome.exe" -ArgumentList "--start-maximized","--new-window",$url

# Wait for browser and page load
Write-Host "Waiting for page to load..."
Start-Sleep -Seconds 10

# Screenshot function
function Capture-Screen {
    param([string]$filename)
    $bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bmp = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.CopyFromScreen(0, 0, 0, 0, $bounds.Size)
    $savePath = Join-Path $PSScriptRoot $filename
    $bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $gfx.Dispose()
    $bmp.Dispose()
    Write-Host "Captured: $filename"
}

# Capture top of page
Capture-Screen "final-1-top.png"
Start-Sleep -Seconds 2

# Scroll and capture
for ($i = 2; $i -le 6; $i++) {
    [System.Windows.Forms.SendKeys]::SendWait(" ")  # Space bar to scroll
    Start-Sleep -Seconds 2
    Capture-Screen "final-$i-scroll.png"
}

Write-Host "Done!"

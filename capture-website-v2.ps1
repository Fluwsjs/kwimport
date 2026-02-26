# Close any existing Chrome windows
Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Load required assemblies
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Start Chrome in a new window with specific size
$url = "https://www.gijsautoimport.nl/"
$chromeArgs = @(
    "--start-maximized",
    "--new-window",
    "--disable-extensions",
    $url
)

Write-Host "Starting Chrome with URL: $url"
$chrome = Start-Process "chrome.exe" -ArgumentList $chromeArgs -PassThru

# Wait longer for page to fully load
Write-Host "Waiting for page to load..."
Start-Sleep -Seconds 8

# Function to capture screenshot
function Capture-Screenshot {
    param([string]$filename)
    
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $fullPath = Join-Path $PSScriptRoot $filename
    $bitmap.Save($fullPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Screenshot saved: $filename"
}

# Capture initial view
Capture-Screenshot "gijs-screenshot-1.png"
Start-Sleep -Seconds 2

# Scroll down using keyboard
Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class KeyboardHelper {
        [DllImport("user32.dll")]
        public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
    }
"@

# Scroll down multiple times
for ($i = 2; $i -le 5; $i++) {
    # Press Page Down (0x22)
    [KeyboardHelper]::keybd_event(0x22, 0, 0, [UIntPtr]::Zero)
    Start-Sleep -Milliseconds 100
    [KeyboardHelper]::keybd_event(0x22, 0, 2, [UIntPtr]::Zero)
    
    Start-Sleep -Seconds 2
    Capture-Screenshot "gijs-screenshot-$i.png"
}

Write-Host "All screenshots captured!"

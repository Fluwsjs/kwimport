# Load required assemblies
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Start Chrome with the target URL
$url = "https://www.gijsautoimport.nl/"
$chrome = Start-Process "chrome.exe" -ArgumentList "--start-maximized", "--new-window", $url -PassThru

# Wait for page to load
Write-Host "Waiting for page to load..."
Start-Sleep -Seconds 5

# Function to capture screenshot
function Capture-Screenshot {
    param([string]$filename)
    
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bitmap.Save("$PSScriptRoot\$filename", [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Screenshot saved: $filename"
}

# Capture initial view
Capture-Screenshot "competitor-screenshot-1-top.png"

# Scroll down and capture more sections
Add-Type @"
    using System;
    using System.Runtime.InteropServices;
    public class WindowHelper {
        [DllImport("user32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
        [DllImport("user32.dll")]
        public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);
    }
"@

Start-Sleep -Seconds 2

# Send Page Down keys to scroll
for ($i = 1; $i -le 3; $i++) {
    # Send Page Down key (VK_NEXT = 0x22)
    [WindowHelper]::keybd_event(0x22, 0, 0, [UIntPtr]::Zero)
    [WindowHelper]::keybd_event(0x22, 0, 2, [UIntPtr]::Zero)
    
    Start-Sleep -Seconds 2
    Capture-Screenshot "competitor-screenshot-$($i+1)-scroll.png"
}

Write-Host "All screenshots captured successfully!"

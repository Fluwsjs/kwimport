Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Create Chrome process
$chrome = Start-Process "chrome.exe" -ArgumentList "--new-window", "http://localhost:3000" -PassThru
Start-Sleep -Seconds 3

# Capture screenshot
$screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)

# Save screenshot
$bitmap.Save("$PSScriptRoot\screenshot-home.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Screenshot saved to screenshot-home.png"

# Navigate to BPM calculator
Start-Process "chrome.exe" -ArgumentList "http://localhost:3000/bpm-calculator"
Start-Sleep -Seconds 3

# Capture second screenshot
$bitmap2 = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
$graphics2 = [System.Drawing.Graphics]::FromImage($bitmap2)
$graphics2.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
$bitmap2.Save("$PSScriptRoot\screenshot-bpm-calculator.png", [System.Drawing.Imaging.ImageFormat]::Png)

Write-Host "Screenshot saved to screenshot-bpm-calculator.png"

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
$graphics2.Dispose()
$bitmap2.Dispose()

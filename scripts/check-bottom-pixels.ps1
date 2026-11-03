Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile("d:/Globizs/Projects/Kids_Foundation/frontend/public/images/academic-primary.jpg")
Write-Host "Image dimensions: $($bmp.Width) x $($bmp.Height)"
for ($y = $bmp.Height - 10; $y -lt $bmp.Height; $y++) {
    $p = $bmp.GetPixel(100, $y)
    Write-Host "Y=$y R=$($p.R) G=$($p.G) B=$($p.B)"
}
$bmp.Dispose()

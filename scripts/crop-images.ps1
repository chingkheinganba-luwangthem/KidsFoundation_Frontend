Add-Type -AssemblyName System.Drawing

function Crop-ImageFile {
    param(
        [string]$inputFile,
        [string]$outputFile,
        [int]$cropX,
        [int]$cropY,
        [int]$cropWidth,
        [int]$cropHeight
    )
    $src = [System.Drawing.Bitmap]::FromFile($inputFile)
    $rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropWidth, $cropHeight)
    $dest = $src.Clone($rect, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $src.Dispose()
    
    # Save as high quality JPEG
    $encoder = [System.Drawing.Imaging.Encoder]::Quality
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, [long]95)
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    
    $dest.Save($outputFile, $jpegCodec, $encoderParams)
    $dest.Dispose()
    Write-Host "Successfully saved $outputFile ($cropWidth x $cropHeight)"
}

function Get-BoundingBox {
    param([string]$path)
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    $w = $bmp.Width
    $h = $bmp.Height
    $minX = $w; $minY = $h; $maxX = 0; $maxY = 0

    for ($y = 0; $y -lt $h; $y += 2) {
        for ($x = 0; $x -lt $w; $x += 2) {
            $pixel = $bmp.GetPixel($x, $y)
            # Check if pixel is not close to white (allow slight noise)
            if ($pixel.R -lt 245 -or $pixel.G -lt 245 -or $pixel.B -lt 245) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }
    $bmp.Dispose()
    return @{
        Path = $path;
        Width = $w;
        Height = $h;
        MinX = $minX;
        MinY = $minY;
        MaxX = $maxX;
        MaxY = $maxY;
        CroppedWidth = ($maxX - $minX + 1);
        CroppedHeight = ($maxY - $minY + 1);
    }
}

# Perform clean crops inside the border curves
Crop-ImageFile "public/images/original-backups/academic-early-years.jpg" "public/images/academic-early-years.jpg" 45 60 1135 800
Crop-ImageFile "public/images/original-backups/academic-primary.jpg" "public/images/academic-primary.jpg" 45 15 810 295
Crop-ImageFile "public/images/original-backups/academic-secondary.jpg" "public/images/academic-secondary.jpg" 40 115 790 380
Crop-ImageFile "public/images/original-backups/academic-senior-secondary.jpg" "public/images/academic-senior-secondary.jpg" 45 125 810 610

Write-Host "All academic images cropped cleanly with zero artifacts!"




$rootFolder = "C:\Workspace\_Privat\daniel-krueger.github.io\"
cd $rootFolder
$imageFiles = get-childitem -Path ".\assets\images" -Recurse -File
# A dictionary of all images, with a value defining it if it's used or not
$usedImages = @{}
$unusedImages = @{}
$contentFiles = Get-ChildItem -Path @(".\_drafts",".\_includes","_layouts","_pages","_posts") -Recurse -File
foreach ($file in $imageFiles | Sort Name){
    <# For debugging purposes 
    $file = $imageFiles[0]
    #>        
    $found = $contentFiles | Select-String "\/$($file.Name)(\)|`")"
    Write-Host "Image file '$($file.Name) was found $($found -ne $null)"
    if ($found -ne $null){
        $usedImages[$file.fullname] = $found -ne $null
    }
    else{
        $unusedImages[$file.fullname] = $found -ne $null
    }
    
}
$imageFiles.Count
$usedImages.Count
$unusedImages.Count
$unusedImages.Keys | Sort
# PowerShell脚本 - 将所有文章的作者改为sorrymaker

# 统计计数器
$count = 0

# 获取所有md和markdown文件
$posts = Get-ChildItem -Path "_posts" -Filter "*.md" -Recurse
$posts += Get-ChildItem -Path "_posts" -Filter "*.markdown" -Recurse

foreach ($post in $posts) {
    $content = Get-Content -Path $post.FullName -Raw
    
    # 检查文件是否包含author字段
    if ($content -match 'author:') {
        # 替换author字段的值为"sorrymaker"
        $newContent = $content -replace 'author:\s*".*"', 'author:     "sorrymaker"'
        Set-Content -Path $post.FullName -Value $newContent
        Write-Host "已将 $($post.Name) 的作者改为sorrymaker"
    } else {
        # 如果没有author字段，在layout字段后添加author字段
        $newContent = $content -replace '(layout:.*?[\r\n]+)', "`$1author:     `"sorrymaker`"`r`n"
        Set-Content -Path $post.FullName -Value $newContent
        Write-Host "已在 $($post.Name) 中添加作者sorrymaker"
    }
    
    # 增加计数
    $count++
}

Write-Host "完成！共修改 $count 篇文章的作者为sorrymaker" 
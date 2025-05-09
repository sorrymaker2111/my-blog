/**
 * 修复代码块在移动设备上显示的问题
 * 特别是解决代码块滑动时出现的垂直线问题
 */
document.addEventListener('DOMContentLoaded', function() {
    // 针对移动设备
    if (window.innerWidth <= 767) {
        // 处理所有代码块
        var codeBlocks = document.querySelectorAll('.highlighter-rouge .highlight');
        
        codeBlocks.forEach(function(block) {
            // 查找table元素
            var table = block.querySelector('table.rouge-table');
            if (table) {
                // 查找gutter列
                var gutter = table.querySelector('td.rouge-gutter');
                if (gutter) {
                    // 完全删除gutter列
                    gutter.parentNode.removeChild(gutter);
                }
                
                // 确保代码列样式正确
                var codeCell = table.querySelector('td.rouge-code');
                if (codeCell) {
                    codeCell.style.display = 'block';
                    codeCell.style.width = '100%';
                    codeCell.style.border = 'none';
                }
                
                // 移除表格所有边框
                table.style.border = 'none';
                table.style.borderCollapse = 'collapse';
                
                // 处理表格的行
                var rows = table.querySelectorAll('tr');
                rows.forEach(function(row) {
                    row.style.border = 'none';
                    row.style.display = 'block';
                });
            }
            
            // 确保代码块有正确的滚动行为
            block.style.overflowX = 'auto';
            block.style.WebkitOverflowScrolling = 'touch';
        });
    }
    
    // 添加双击事件监听器，用于复制代码块内容
    var preElements = document.querySelectorAll('pre');
    preElements.forEach(function(pre) {
        pre.addEventListener('dblclick', function() {
            var codeElement = pre.querySelector('code');
            if (codeElement) {
                var range = document.createRange();
                range.selectNode(codeElement);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
                
                try {
                    // 尝试复制
                    var successful = document.execCommand('copy');
                    var msg = successful ? '代码已复制到剪贴板' : '复制失败，请手动复制';
                    
                    // 显示复制成功提示
                    var notification = document.createElement('div');
                    notification.textContent = msg;
                    notification.style.position = 'fixed';
                    notification.style.bottom = '20px';
                    notification.style.left = '50%';
                    notification.style.transform = 'translateX(-50%)';
                    notification.style.padding = '10px 20px';
                    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    notification.style.color = 'white';
                    notification.style.borderRadius = '4px';
                    notification.style.zIndex = '9999';
                    document.body.appendChild(notification);
                    
                    // 2秒后移除提示
                    setTimeout(function() {
                        document.body.removeChild(notification);
                    }, 2000);
                } catch (err) {
                    console.error('无法复制代码: ', err);
                }
                
                // 清除选择
                window.getSelection().removeAllRanges();
            }
        });
    });
}); 
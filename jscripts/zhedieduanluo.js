document.addEventListener('DOMContentLoaded', function() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取按钮后面的第一个折叠列表
            const targetList = this.nextElementSibling;
            if (targetList && targetList.classList.contains('collapsed')) {
                // 切换展开/折叠状态
                targetList.classList.toggle('expanded');
                // 更新按钮文本
                this.textContent = targetList.classList.contains('expanded') ? '收起内容' : '展开内容';
            }
        });
    });
});
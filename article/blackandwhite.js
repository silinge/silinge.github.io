const blocks = document.querySelectorAll('.blocks'); // 获取所有 class 为 "blocks" 的元素
const body = document.querySelector('body'); // 获取 body 元素

blocks.forEach(block => { // 遍历所有 blocks 元素
    const href = block.dataset.href; // 获取 data-href 属性值
    const text = block.textContent; // 获取 div 内的文本内容

    if (href) { // 确保 href 存在
        const linkBlock = document.createElement('a'); // 创建 a 标签
        linkBlock.href = href; // 设置 a 标签的 href 属性
        linkBlock.classList.add('link-block'); // 添加 class "link-block"
        const span = document.createElement('span'); // 创建 span 标签
        span.textContent = text; // 设置 span 标签的文本内容
        linkBlock.appendChild(span); // 将 span 标签添加到 a 标签内

        body.appendChild(linkBlock); // 将 a 标签添加到 body 中
            // 获取计算后的高度并设置CSS变量，使字体大小和高度关联起来
        const computedStyle = window.getComputedStyle(linkBlock);
        const blockHeight = parseFloat(computedStyle.paddingBottom);
        linkBlock.style.setProperty('--block-height', blockHeight + 'px');
        linkBlock.addEventListener('click', (event) => {
            event.preventDefault();//阻止a标签默认跳转
            window.open(linkBlock.href, '_blank'); // 在新窗口/标签页打开
            });
    }
    block.style.display = 'none'; // 隐藏原始的 div 元素
});
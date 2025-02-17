// 异步加载JSON数据
async function loadLinks() {
    try {
        // 从links.json文件加载链接数据
        const response = await fetch('../json/linksA.json');
        const data = await response.json();
        return data.links;
    } catch (error) {
        console.error('加载链接失败:', error);
        return [];
    }
}

// 渲染链接的函数
function renderLinks(linksToShow) {
    const linksContainer = document.getElementById('linksContainer');
    const noResultsMessage = document.getElementById('noResults');
    
    linksContainer.innerHTML = ''; // 清空现有链接
    
    linksToShow.forEach(link => {
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'link-item';
        linkElement.target = '_blank';
        
        // 创建链接的内部HTML结构
        linkElement.innerHTML = `
            <div class="link-name">${link.name}</div>
            <div class="link-category">${link.category}</div>
        `;
        
        linksContainer.appendChild(linkElement);
    });

    // 控制无结果提示的显示
    noResultsMessage.style.display = linksToShow.length === 0 ? 'block' : 'none';
}

// 搜索功能
function setupSearch(links) {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        // 过滤链接，支持名称、分类和描述搜索
        const filteredLinks = links.filter(link => 
            link.name.toLowerCase().includes(searchTerm) || 
            link.category.toLowerCase().includes(searchTerm) ||
            (link.description && link.description.toLowerCase().includes(searchTerm))
        );
        
        renderLinks(filteredLinks);
    });
}

// 初始化函数
async function init() {
    const links = await loadLinks();
    renderLinks(links);
    setupSearch(links);
}

// 页面加载时初始化
init();
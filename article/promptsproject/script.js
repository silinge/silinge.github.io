document.addEventListener('DOMContentLoaded', function() {
    const promptsContainer = document.getElementById('promptsContainer');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    // 添加Markdown解析库
    const markdownScript = document.createElement('script');
    markdownScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    document.head.appendChild(markdownScript);
    
    // 从JSON文件加载提示词数据
    let promptsData = [];
    
    // 使用fetch API从prompts.json文件加载数据
    fetch('prompts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('无法加载提示词数据');
            }
            return response.json();
        })
        .then(data => {
            promptsData = data;
            // 数据加载完成后处理并渲染提示词卡片
            processAndRenderPrompts(promptsData);
        })
        .catch(error => {
            console.error('加载提示词数据时出错:', error);
            promptsContainer.innerHTML = '<div class="no-results">加载提示词数据失败</div>';
        });
        
    // 处理提示词数据，加载Markdown文件
    async function processAndRenderPrompts(prompts) {
        const processedPrompts = [];
        
        // 创建一个Promise数组来处理所有提示词
        const promises = prompts.map(async (prompt) => {
            // 检查是否为Markdown文件
            if (prompt.isMarkdown && prompt.content) {
                try {
                    // 加载Markdown文件内容
                    const response = await fetch(prompt.content);
                    if (!response.ok) {
                        throw new Error(`无法加载Markdown文件: ${prompt.content}`);
                    }
                    const markdownContent = await response.text();
                    // 处理Markdown内容中的特殊字符，确保符合JSON格式要求
                    const escapedContent = escapeJsonString(markdownContent);
                    // 创建一个新的提示词对象，包含原始数据和处理后的Markdown内容
                    return {
                        ...prompt,
                        originalContent: prompt.content,
                        content: escapedContent,
                        isMarkdownContent: true
                    };
                } catch (error) {
                    console.error(`加载Markdown文件时出错: ${prompt.content}`, error);
                    // 如果加载失败，返回原始提示词，但添加错误信息
                    return {
                        ...prompt,
                        content: `无法加载Markdown文件: ${prompt.content}`,
                        loadError: true
                    };
                }
            }
            // 如果不是Markdown文件，直接返回原始提示词
            return prompt;
        });
        
        // 等待所有Promise完成
        const processedResults = await Promise.all(promises);
        
        // 渲染处理后的提示词
        renderPromptCards(processedResults);
    }


    // 渲染所有提示词卡片
    function renderPromptCards(prompts) {
        promptsContainer.innerHTML = '';
        
        if (prompts.length === 0) {
            promptsContainer.innerHTML = '<div class="no-results">没有找到匹配的提示词</div>';
            return;
        }

        prompts.forEach(prompt => {
            const card = document.createElement('div');
            card.className = 'prompt-card';
            
            // 准备内容，如果是Markdown内容则使用marked解析
            let displayContent = prompt.content;
            let contentToDisplay = '';
            
            // 检查是否为Markdown内容
            if (prompt.isMarkdownContent && typeof marked !== 'undefined') {
                // 使用marked库解析Markdown，确保内容已经被正确转义
                contentToDisplay = `<div class="markdown-content">${marked.parse(displayContent)}</div>`;
            } else {
                // 普通文本内容，保持原样
                contentToDisplay = `<div class="prompt-content">${displayContent}</div>`;
            }
            
            // 存储用于复制的内容，如果是Markdown内容，使用原始内容
            const contentToCopy = prompt.isMarkdownContent && prompt.originalContent ? prompt.originalContent : prompt.content;
            
            card.innerHTML = `
                <div class="card-header">
                    <h2>${prompt.title}</h2>
                    <div class="prompt-id">ID: ${prompt.id}</div>
                </div>
                <div class="card-body">
                    ${contentToDisplay}
                </div>
                <div class="card-footer">
                    <button class="copy-btn" data-content="${encodeURIComponent(contentToCopy)}">
                        <i class="fas fa-copy"></i> 复制内容
                    </button>
                </div>
            `;
            
            promptsContainer.appendChild(card);
        });

        // 添加复制功能
        addCopyFunctionality();
    }

    // 搜索功能
    function searchPrompts(query) {
        query = query.toLowerCase().trim();
        
        if (!query) {
            return promptsData; // 如果搜索为空，返回所有提示词
        }
        
        return promptsData.filter(prompt => {
            // 如果是Markdown文件路径，则检查原始路径和标题
            if (prompt.isMarkdown) {
                return (
                    prompt.title.toLowerCase().includes(query) ||
                    prompt.content.toLowerCase().includes(query) ||
                    prompt.id.toString().includes(query)
                );
            }
            
            // 普通内容或已加载的Markdown内容
            return (
                prompt.title.toLowerCase().includes(query) ||
                prompt.content.toLowerCase().includes(query) ||
                prompt.id.toString().includes(query)
            );
        });
    }

    // 添加复制功能
    function addCopyFunctionality() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const content = decodeURIComponent(this.getAttribute('data-content'));
                copyToClipboard(content);
                showCopyTooltip();
            });
        });
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // 显示复制成功提示
    function showCopyTooltip() {
        let tooltip = document.querySelector('.copy-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            tooltip.textContent = '复制成功！';
            document.body.appendChild(tooltip);
        }
        
        tooltip.classList.add('show');
        
        setTimeout(() => {
            tooltip.classList.remove('show');
        }, 2000);
    }

    // 搜索事件监听
    searchButton.addEventListener('click', function() {
        const query = searchInput.value;
        const filteredPrompts = searchPrompts(query);
        processAndRenderPrompts(filteredPrompts);
    });

    searchInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            const query = searchInput.value;
            const filteredPrompts = searchPrompts(query);
            processAndRenderPrompts(filteredPrompts);
        }
    });

    // 搜索事件会在数据加载后触发渲染
    
    // 转义JSON字符串中的特殊字符
    function escapeJsonString(str) {
        if (!str) return str;
        
        // 替换所有需要转义的特殊字符
        return str
            .replace(/\\/g, '\\\\') // 反斜杠
            .replace(/"/g, '\\"')    // 双引号
            .replace(/\b/g, '\\b')   // 退格符
            .replace(/\f/g, '\\f')   // 换页符
            .replace(/\n/g, '\\n')   // 换行符
            .replace(/\r/g, '\\r')   // 回车符
            .replace(/\t/g, '\\t');  // 制表符
    }
});
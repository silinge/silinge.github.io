// 配置
const QUESTIONS_PER_PAGE = 20;
let currentPage = 1;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    let allQuestions = []; // 存储所有问题数据

    // 获取搜索相关元素
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    // 搜索功能实现
    function searchQuestions(keyword) {
        if (!keyword.trim()) {
            displayQuestions(allQuestions); // 如果搜索词为空，显示所有问题
            return;
        }

        const results = allQuestions.filter(question => 
            question.title.toLowerCase().includes(keyword.toLowerCase())
        );
        displayQuestions(results);
    }

    // 绑定搜索事件
    searchButton.addEventListener('click', () => {
        searchQuestions(searchInput.value);
    });

    // 添加回车搜索功能
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchQuestions(searchInput.value);
        }
    });

    // 修改原有的加载问题函数
    async function loadQuestions() {
        try {
            const response = await fetch('../json/ds_question.json');
            allQuestions = await response.json(); // 保存所有问题
            displayQuestions(allQuestions);
            
            // 获取最后一个有效问题
            const lastValidQuestion = allQuestions
                .filter(q => q.title.trim())
                .pop();
                
            if (lastValidQuestion) {
                // 加载最后一个问题的答案
                loadAnswer(lastValidQuestion.id);
                // 高亮最后一个问题
                const lastQuestionElement = document.querySelector(`[data-id="${lastValidQuestion.id}"]`);
                if (lastQuestionElement) {
                    lastQuestionElement.parentElement.classList.add('active');
                }
            }
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }

   // ... existing code ...

// 修改显示问题列表的函数
function displayQuestions(questions) {
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';
    
    // 计算分页
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(start, end);
    
    // 显示当前页的问题
    pageQuestions.forEach(question => {
        if (question.title.trim()) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-id="${question.id}">[${question.id}] ${question.title}</a>`;
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                loadAnswer(question.id);
                const allItems = questionList.querySelectorAll('li');
                allItems.forEach(item => item.classList.remove('active'));
                li.classList.add('active');
            });
            questionList.appendChild(li);
        }
    });

    // 更新分页按钮
    renderPagination(questions.length);
}

// 修改分页渲染函数
function renderPagination(totalCount) {
    const topPagination = document.querySelector('.top-pagination');
    const bottomPagination = document.querySelector('.bottom-pagination');
    
    if (!topPagination || !bottomPagination) return;
    
    topPagination.innerHTML = '';
    bottomPagination.innerHTML = '';
    
    const pageCount = Math.ceil(totalCount / QUESTIONS_PER_PAGE);
    
    // 移除了 if (pageCount > 1) 的判断，始终显示页码
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.className = 'page-btn';
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            displayQuestions(allQuestions);
        };
        topPagination.appendChild(button);
        bottomPagination.appendChild(button.cloneNode(true));
    }
}

    // 初始加载
    loadQuestions();
});

function renderQuestionList(questions) {
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';
    
    // 根据当前页码获取显示的问题范围
    const start = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    const pageQuestions = questions.slice(start, end);
    
    pageQuestions.forEach((question, index) => {
        const li = document.createElement('li');
        // Add question ID before the title
        li.textContent = `[${question.id}] ${question.title}`;
        li.onclick = () => loadAnswer(question.id);
        questionList.appendChild(li);
    });
}

async function loadAnswer(questionId) {
    try {
        // 获取答案数据
        const response = await fetch('../json/ds_answer.json');
        const answers = await response.json();
        const answer = answers.find(answer => answer.id === questionId);
        
        if (answer && answer.mdFile) {
            // 获取对应的 Markdown 文件内容
            const mdResponse = await fetch(`../${answer.mdFile}`);
            if (!mdResponse.ok) {
                throw new Error('Markdown file not found');
            }
            const mdContent = await mdResponse.text();
            
            // 使用 marked 转换 Markdown 为 HTML
            document.getElementById('answer').innerHTML = marked.parse(mdContent);
        } else {
            document.getElementById('answer').innerHTML = '答案未找到';
        }
    } catch (error) {
        console.error('Error loading answer:', error);
        document.getElementById('answer').innerHTML = '加载答案时出错';
    }
}

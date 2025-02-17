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
        } catch (error) {
            console.error('Error loading questions:', error);
        }
    }

    // 显示问题列表
    function displayQuestions(questions) {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach(question => {
            if (question.title.trim()) {  // 只显示有标题的问题
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" data-id="${question.id}">${question.title}</a>`;
                li.querySelector('a').addEventListener('click', (e) => {
                    e.preventDefault();
                    loadAnswer(question.id);
                });
                questionList.appendChild(li);
            }
        });
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

function renderPagination(totalCount) {
    const topPagination = document.querySelector('.top-pagination');
    const bottomPagination = document.querySelector('.bottom-pagination');
    
    topPagination.innerHTML = '';
    bottomPagination.innerHTML = '';
    
    const pageCount = Math.ceil(totalCount / QUESTIONS_PER_PAGE);
    
    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.className = 'page-btn';
        button.textContent = i;
        button.onclick = () => {
            currentPage = i;
            loadQuestions();
        };
        topPagination.appendChild(button);
        bottomPagination.appendChild(button.cloneNode(true));
    }
}

function loadAnswer(questionId) {
    fetch('../json/ds_answer.json')
        .then(response => response.json())
        .then(answers => {
            const answer = answers.find(answer => answer.id === questionId);
            if (answer) {
                document.getElementById('answer').textContent = answer.content;
            } else {
                document.getElementById('answer').textContent = '答案未找到';
            }
        })
        .catch(error => console.error('Error:', error));
}

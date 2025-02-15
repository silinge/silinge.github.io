// 配置
const QUESTIONS_PER_PAGE = 20;
let currentPage = 1;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
});

function loadQuestions() {
    fetch('../json/ds_question.json')
        .then(response => response.json())
        .then(questions => {
            // Filter out questions with empty id or title
            const validQuestions = questions.filter(q => q.id && q.title);
            renderQuestionList(validQuestions);
            renderPagination(validQuestions.length);
        })
        .catch(error => console.error('Error:', error));
}

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

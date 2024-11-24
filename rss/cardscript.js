document.addEventListener('DOMContentLoaded', function () {
    var usernames = document.querySelectorAll('.username');
    usernames.forEach(function (username) {
        username.addEventListener('click', function () {
            var user = this.getAttribute('data-user');
            // 隐藏所有内容区域
            var contents = document.querySelectorAll('.content');
            contents.forEach(function (content) {
                content.classList.add('hidden');
            });
            // 显示对应用户的内容区域
            var userContent = document.getElementById(user + '-content');
            if (userContent) {
                userContent.classList.remove('hidden');
            }
        });
    });
    // 默认显示第一个用户的内容
    var firstUsername = document.querySelector('.username');
    if (firstUsername) {
        var user = firstUsername.getAttribute('data-user');
        var userContent = document.getElementById(user + '-content');
        if (userContent) {
            userContent.classList.remove('hidden');
        }
    }
});

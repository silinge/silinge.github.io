document.addEventListener('DOMContentLoaded', function () {
    var usernames = document.querySelectorAll('.username');
    usernames.forEach(function (username) {
        username.addEventListener('click', function () {
            var user = this.getAttribute('data-user');
            
            // 激活当前点击的用户名
            usernames.forEach(function (u) {
                u.classList.remove('active');
            });
            this.classList.add('active');

            // 隐藏所有内容区域
            var contents = document.querySelectorAll('.content');
            contents.forEach(function (content) {
                content.classList.add('hidden');
            });

            // 显示对应用户的内容区域
            var userContent = document.getElementById(user + '-content');
            if (userContent) {
                userContent.classList.remove('hidden');

                // 同时移除内部所有子级内容的 'hidden' 类
                var nestedContents = userContent.querySelectorAll('.content.hidden');
                nestedContents.forEach(function (nestedContent) {
                    nestedContent.classList.remove('hidden');
                });
            }
        });
    });

    // 默认显示第一个用户的内容
    if (usernames.length > 0) {
        usernames[0].click();
    }
});

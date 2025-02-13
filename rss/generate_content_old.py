import requests
from datetime import datetime, timedelta
import pytz
from dateutil.parser import parse
from jinja2 import Environment, Template
from bs4 import BeautifulSoup
import feedparser

# 定义用户ID列表
user_ids_base = [
    '1694917363', '2522334710', '2214838982', '1655747731', '1649111590',
    '7746281422', '1881320895', '1404521940', '1260797924', '1432187644',
    '7188823772', '1240212845', '1668726803', '1941998575', '1912273717',
    '5283695116', '2213561393', '5103458366', '1454560380', '5692692520',
    '3867285047', '2194035935', '2987585965', '1778375693', '1659643027',
    '5466550668', '7217947278', '1670743152', '6827625527', '1092211747',
    '6048569942', '3138279871', '2400966427', '5722964389', '1727858283',
    '7416690461', '1253846303', '5955106173'
]

# 假设user_names字典如下，需要手动填写或通过其他方式获取
user_names = {
    '1694917363': '用户A',
    '2522334710': '用户B',
    # 其他用户ID和名称的映射
    # 需要确保所有user_id都有对应的名称
}

# 生成rss_urls列表，每个元素是一个字典，包含'user_id'和'url'
rss_urls = [{'user_id': user_id, 'url': f'https://rsshub.app/weibo/user/{user_id}'} for user_id in user_ids_base]

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# 定义模板
template_str = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>微博汇总</title>
    <link rel="stylesheet" href="lasteststyles.css">
</head>
<body>
    <h1>微博汇总</h1>
    {% for entry in entries %}
    <div>
        <h2><a href="{{ entry.link }}">{{ entry.title }}</a></h2>
        <p>{{ entry.description }}</p>
        <p class="published">发布时间: {{ entry.published }}</p>
    </div>
    {% endfor %}
</body>
</html>
'''
template = Environment().from_string(template_str)

# 获取当前时间（北京时间）
beijing_tz = pytz.timezone('Asia/Shanghai')
now = datetime.now(beijing_tz)
twelve_hours_ago = now - timedelta(hours=12)

# 合并所有用户的微博条目
all_entries = []

for user_info in rss_urls:
    user_id = user_info['user_id']
    url = user_info['url']
    user_name = user_names.get(user_id, '未知用户')
    r = requests.get(url, headers=headers)
    feed = feedparser.parse(r.content)
    for entry in feed.entries:
        link = entry.get('link', '')
        description = entry.get('description', '')
        published = entry.get('published', '')

        # 解析description，查找class="text-3xl"的元素
        soup = BeautifulSoup(description, 'html.parser')
        text_3xl_element = soup.find(class_='text-3xl')
        if text_3xl_element:
            title = text_3xl_element.get_text().strip()
        else:
            title = user_name

        # 获取description的纯文本内容
        description_text = soup.get_text()

        # 处理发布时间
        try:
            published_time = parse(published)
            published_time = published_time.astimezone(beijing_tz)
            if published_time >= twelve_hours_ago:
                entry_data = {
                    'title': title,
                    'link': link,
                    'description': description_text,
                    'published': published_time.strftime('%Y-%m-%d %H:%M:%S'),
                    'published_time': published_time
                }
                all_entries.append(entry_data)
        except ValueError:
            print(f"无法解析发布时间: {published}")

# 按发布时间从新到旧排序
all_entries.sort(key=lambda x: x['published_time'], reverse=True)

# 生成HTML内容
html_output = template.render(entries=all_entries)

# 保存HTML文件，覆盖之前生成的文件
with open('rss/latest.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

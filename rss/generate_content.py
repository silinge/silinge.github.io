""" import requests
from lxml import etree
from datetime import datetime, timedelta
import pytz
from dateutil.parser import parse
from jinja2 import Environment, Template
import os

# 定义RSS URL
rss_urls = {
    'user1': 'https://rsshub.app/weibo/user/1659643027',
    'user2': 'https://rsshub.app/weibo/user/1253846303'
}

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# 定义模板字符串
template_str = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ content.title }}</title>
</head>
<body>
    <h1>{{ content.title }}</h1>
    {% for entry in content.entries %}
    <div>
        <h2><a href="{{ entry.link }}">{{ entry.title }}</a></h2>
        <p>{{ entry.description }}</p>
        <p>{{ entry.published }}</p>
    </div>
    {% endfor %}
</body>
</html>
'''

# 创建Template对象
template = Environment().from_string(template_str)

# 获取当前时间（UTC）
now = datetime.now(pytz.utc)
twelve_hours_ago = now - timedelta(hours=24)

# 生成HTML页面
for user, url in rss_urls.items():
    r = requests.get(url, headers=headers)
    tree = etree.fromstring(r.text.encode('utf-8'))
    entries = tree.xpath('//item')
    filtered_entries = []
    for entry in entries:
        title = entry.find('title').text
        link = entry.find('link').text
        description = entry.find('description').text
        published = entry.find('pubDate').text
        try:
            published_time = parse(published)
            published_time = published_time.astimezone(pytz.utc)
            if published_time >= twelve_hours_ago:
                entry_data = {
                    'title': title,
                    'link': link,
                    'description': description,
                    'published': published_time.strftime('%Y-%m-%d %H:%M:%S UTC')
                }
                filtered_entries.append(entry_data)
        except ValueError:
            print(f"无法解析发布时间: {published}")
    if filtered_entries:
        # 获取标题
        title_element = tree.find('.//channel/title')
        if title_element is not None:
            content_title = title_element.text
        else:
            content_title = '微博内容'
        content = {
            'title': content_title,
            'entries': filtered_entries
        }
        html_output = template.render(content=content)
        output_path = os.path.join('output', f'{user}.html')
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(html_output)
    else:
        print(f"No recent content available for {user}") 


import requests
from lxml import etree
from datetime import datetime, timedelta
import pytz
from dateutil.parser import parse
from jinja2 import Environment, Template
import os
import re

# 定义RSS URL
rss_urls = {
    'user1': 'https://rsshub.app/weibo/user/1659643027',
    'user2': 'https://rsshub.app/weibo/user/1253846303'
}

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# 定义文件名净化函数
def sanitize_filename(filename):
    return re.sub(r'[\\/*?:"<>|]', '_', filename)

# 获取当前时间（UTC）
now = datetime.now(pytz.utc)
twelve_hours_ago = now - timedelta(hours=12)

# 生成Markdown文件
for user, url in rss_urls.items():
    r = requests.get(url, headers=headers)
    tree = etree.fromstring(r.text.encode('utf-8'))
    entries = tree.xpath('//item')
    filtered_entries = []
    for entry in entries:
        title = entry.find('title').text
        link = entry.find('link').text
        description = entry.find('description').text
        published = entry.find('pubDate').text
        try:
            published_time = parse(published)
            published_time = published_time.astimezone(pytz.utc)
            if published_time >= twelve_hours_ago:
                entry_data = {
                    'title': title,
                    'link': link,
                    'description': description,
                    'published': published_time.strftime('%Y-%m-%d %H:%M:%S UTC')
                }
                filtered_entries.append(entry_data)
        except ValueError:
            print(f"无法解析发布时间: {published}")
    if filtered_entries:
        # 获取标题
        title_element = tree.find('.//channel/title')
        if title_element is not None:
            title_str = title_element.text
            match = re.search(r'微博 - (.*?)的微博', title_str)
            if match:
                username = match.group(1)
            else:
                username = 'user' + user
            username = sanitize_filename(username)
        else:
            username = 'user' + user
            username = sanitize_filename(username)
        # 生成Markdown内容
        with open(f'{username}.md', 'w', encoding='utf-8') as f:
            f.write(f'# {username} 的微博\n\n')
            for entry in filtered_entries:
                f.write(f'## {entry["title"]}\n\n')
                f.write(f'{entry["description"]}\n\n')
                f.write(f'发布时间: {entry["published"]}\n\n')
    else:
        print(f"No recent content available for {user}") """

import requests
from lxml import etree
from datetime import datetime, timedelta
import pytz
from dateutil.parser import parse
from jinja2 import Environment, Template
import os
import re

# 定义RSS URL
rss_urls = {
    'user1': 'https://rsshub.app/weibo/user/1659643027',
    'user2': 'https://rsshub.app/weibo/user/1253846303'
}

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# 定义模板字符串
template_str = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>微博汇总</title>
</head>
<body>
    <h1>微博汇总</h1>
    {% for entry in entries %}
    <div>
        <h2><a href="{{ entry.link }}">{{ entry.title }}</a></h2>
        <p>{{ entry.description }}</p>
        <p>发布时间: {{ entry.published }}</p>
    </div>
    {% endfor %}
</body>
</html>


# 创建Template对象
template = Environment().from_string(template_str)

# 获取当前时间（北京时间）
beijing_tz = pytz.timezone('Asia/Shanghai')
now = datetime.now(beijing_tz)
twelve_hours_ago = now - timedelta(hours=12)

# 合并所有用户的微博条目
all_entries = []

for user, url in rss_urls.items():
    r = requests.get(url, headers=headers)
    tree = etree.fromstring(r.text.encode('utf-8'))
    entries = tree.xpath('//item')
    for entry in entries:
        title = entry.find('title').text
        link = entry.find('link').text
        description = entry.find('description').text
        published = entry.find('pubDate').text
        try:
            published_time = parse(published)
            published_time = published_time.astimezone(beijing_tz)
            if published_time >= twelve_hours_ago:
                entry_data = {
                    'title': title,
                    'link': link,
                    'description': description,
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

# 以北京时间命名文件
filename = now.strftime('%Y-%m-%d_%H-%M-%S') + '.html'

# 保存HTML文件，覆盖之前生成的文件
with open(filename, 'w', encoding='utf-8') as f:
    f.write(html_output)

# 如果需要，可以删除之前的文件
# 由于每次都生成新的文件名，所以不需要删除旧文件
# 如果要保留一个文件，可以每次都用同一个文件名，例如 'latest.html'
# with open('latest.html', 'w', encoding='utf-8') as f:
#     f.write(html_output)
'''
import requests
from lxml import etree
from datetime import datetime, timedelta
import pytz
from dateutil.parser import parse
from jinja2 import Environment, Template
import os
import re

# 定义RSS URL
rss_urls = {
    'user1': 'https://rsshub.app/weibo/user/1659643027',
    'user2': 'https://rsshub.app/weibo/user/1253846303'
}

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# 定义模板字符串
template_str = '''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>微博汇总</title>
</head>
<body>
    <h1>微博汇总</h1>
    {% for entry in entries %}
    <div>
        <h2><a href="{{ entry.link }}">{{ entry.title }}</a></h2>
        <p>{{ entry.description }}</p>
        <p>发布时间: {{ entry.published }}</p>
    </div>
    {% endfor %}
</body>
</html>
'''

# 创建Template对象
template = Environment().from_string(template_str)

# 获取当前时间（北京时间）
beijing_tz = pytz.timezone('Asia/Shanghai')
now = datetime.now(beijing_tz)
twelve_hours_ago = now - timedelta(hours=12)

# 合并所有用户的微博条目
all_entries = []

for user, url in rss_urls.items():
    r = requests.get(url, headers=headers)
    tree = etree.fromstring(r.text.encode('utf-8'))
    entries = tree.xpath('//item')
    for entry in entries:
        title = entry.find('title').text
        link = entry.find('link').text
        description = entry.find('description').text
        published = entry.find('pubDate').text
        try:
            published_time = parse(published)
            published_time = published_time.astimezone(beijing_tz)
            if published_time >= twelve_hours_ago:
                entry_data = {
                    'title': title,
                    'link': link,
                    'description': description,
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
with open('latest.html', 'w', encoding='utf-8') as f:
    f.write(html_output)
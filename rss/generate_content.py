import requests
from lxml import etree
from datetime import datetime, timedelta
import pytz
from dateutil.parser import parse
from jinja2 import Environment, Template
import os
import re

# Define a list of user IDs as strings
user_ids_base = ['1694917363', '2522334710', '2214838982', '1655747731', '1649111590', '7746281422', '1881320895', '1404521940', '1260797924', '1432187644', '7188823772', '1240212845', '1668726803', '1941998575', '1912273717', '5283695116', '2213561393', '5103458366', '1454560380', '5692692520', '3867285047', '2194035935', '2987585965', '1778375693', '1659643027', '5466550668', '7217947278', '1670743152', '6827625527', '1092211747', '6048569942', '3138279871', '2400966427', '5722964389', '1727858283', '7416690461', '1253846303', '5955106173']
user_ids = set(user_ids_base);
# Generate rss_urls dictionary dynamically
rss_urls = {f'user{i+1}': f'https://rsshub.app/weibo/user/{user_id}' for i, user_id in enumerate(user_ids)}

# 定义请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

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
    # tree = etree.fromstring(r.text.encode('utf-8'))
    # 清洗RSS内容，确保所有&符号都被正确转义
    content = r.text.replace('&', '&amp;').replace('&amp;amp;', '&amp;')
    try:
        tree = etree.fromstring(content.encode('utf-8'))
    except etree.XMLSyntaxError as e:
        print(f"XML解析错误: {e}")
        continue
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
with open('rss/latest.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

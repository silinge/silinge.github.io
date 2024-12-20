import requests
from bs4 import BeautifulSoup
from datetime import datetime
import hashlib
import os

# 微博用户ID列表
user_ids = ['1659643027', '1253846303', '1887344341']

# 生成RSS文件
def generate_rss(user_ids):
    rss_content = '''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>微博订阅源</title>
    <link>https://silinge.github.io</link>
    <description>多个用户的微博订阅源</description>
    <atom:link href="https://silinge.github.io/rss/feed.xml" rel="self" type="application/rss+xml" />
    <language>zh-cn</language>
    <lastBuildDate>{last_build_date}</lastBuildDate>
    <pubDate>{pub_date}</pubDate>
    <ttl>60</ttl>
'''

    last_build_date = datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S GMT')
    pub_date = last_build_date

    for user_id in user_ids:
        url = f'https://weibo.com/u/{user_id}'
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # 解析微博内容
        weibo_items = soup.find_all('div', class_='WB_cardwrap WB_feed_type S_bg2')

        html_content = f'''
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <title>微博用户 {user_id} 的微博</title>
</head>
<body>
    <h1>微博用户 {user_id} 的微博</h1>
'''

        for item in weibo_items:
            try:
                title = item.find('div', class_='WB_text W_f14').text.strip()
                link = f'https://weibo.com{item.find("a", class_="WB_time")["href"]}'
                description = item.find('div', class_='WB_text W_f14').text.strip()
                pub_date = item.find('a', class_='WB_time')['title']

                html_content += f'''
    <div>
        <h2>{title}</h2>
        <p>{description}</p>
        <p>发布时间: {pub_date}</p>
        <p><a href="{link}">查看原文</a></p>
    </div>
'''

                rss_content += f'''
    <item>
      <title>{title}</title>
      <link>https://silinge.github.io/weiboUpdate_{user_id}.html</link>
      <description>{description}</description>
      <pubDate>{pub_date}</pubDate>
      <guid>https://silinge.github.io/weiboUpdate_{user_id}.html</guid>
    </item>
'''
            except Exception as e:
                print(f"Error parsing item for user {user_id}: {e}")

        html_content += '''
</body>
</html>
'''

        with open(f'weiboUpdate_{user_id}.html', 'w', encoding='utf-8') as f:
            f.write(html_content)

    rss_content += '''
  </channel>
</rss>
'''

    # 使用 format 方法确保变量正确插入
    rss_content = rss_content.format(last_build_date=last_build_date, pub_date=pub_date)

    with open('rss/feed.xml', 'w', encoding='utf-8') as f:
        f.write(rss_content)

    return rss_content

# 检查文件内容是否发生变化
def has_file_changed(new_content):
    if not os.path.exists('rss/feed.xml'):
        return True

    with open('rss/feed.xml', 'r', encoding='utf-8') as f:
        old_content = f.read()

    return hashlib.md5(old_content.encode()).hexdigest() != hashlib.md5(new_content.encode()).hexdigest()

# 生成RSS文件并检查是否需要提交
new_rss_content = generate_rss(user_ids)
if has_file_changed(new_rss_content):
    with open('rss/feed.xml', 'w', encoding='utf-8') as f:
        f.write(new_rss_content)
    print("RSS feed updated and will be committed.")
else:
    print("RSS feed has not changed. No commit needed.")
    exit(0)  # 如果没有更改，退出脚本
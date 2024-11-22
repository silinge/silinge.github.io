import requests
from bs4 import BeautifulSoup
from datetime import datetime

# 微博用户ID列表
user_ids = ['2269443552', '1253846303', 'Emma古小月', '1659643027']

# 生成RSS文件
def generate_rss(user_ids):
    rss_content = '''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>微博订阅源</title>
    <link>https://silinge.github.io</link>
    <description>微博订阅源</description>
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

        # 这里需要解析微博内容，具体解析方式取决于微博页面的结构
        # 假设我们找到微博内容的标签
        weibo_items = soup.find_all('div', class_='weibo-item')

        for item in weibo_items:
            title = item.find('div', class_='weibo-title').text.strip()
            link = item.find('a', class_='weibo-link')['href']
            description = item.find('div', class_='weibo-description').text.strip()
            pub_date = item.find('span', class_='weibo-date')['data-time']

            rss_content += f'''
    <item>
      <title>{title}</title>
      <link>{link}</link>
      <description>{description}</description>
      <pubDate>{pub_date}</pubDate>
      <guid>{link}</guid>
    </item>
'''

    rss_content += '''
  </channel>
</rss>
'''

    with open('rss/feed.xml', 'w', encoding='utf-8') as f:
        f.write(rss_content)

# 生成RSS文件
generate_rss(user_ids)
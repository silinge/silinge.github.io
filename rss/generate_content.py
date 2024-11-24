import requests
from datetime import datetime, timedelta
import pytz
import json
import os
from dateutil.parser import parse
from jinja2 import Environment, Template
from bs4 import BeautifulSoup
import feedparser
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

class WeiboRSSCrawler:
    def __init__(self, config_file: str = 'rss/config.json'):
        self.config_file = config_file
        self.config = self.load_config()
        self.beijing_tz = pytz.timezone('Asia/Shanghai')
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        
    def load_config(self) -> Dict:
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                default_config = {
                    "user_ids": ['1694917363'],
                    "hours_ago": 12,
                    "max_entries_per_user": 10,
                    "output_dir": "rss",
                    "rsshub_base_url": "https://rsshub.app"
                }
                os.makedirs(os.path.dirname(self.config_file), exist_ok=True)
                with open(self.config_file, 'w', encoding='utf-8') as f:
                    json.dump(default_config, f, indent=4, ensure_ascii=False)
                return default_config
        except Exception as e:
            raise

    def fetch_user_info(self, user_id: str) -> Dict:
        try:
            url = f"{self.config['rsshub_base_url']}/weibo/user/{user_id}"
            response = requests.get(url, headers=self.headers, timeout=10)
            feed = feedparser.parse(response.content)
            
            username = None
            if 'title' in feed.feed and feed.feed.title:
                username = feed.feed.title
            elif feed.entries and len(feed.entries) > 0 and 'author' in feed.entries[0] and feed.entries[0].author:
                username = feed.entries[0].author
            else:
                username = f"User_{user_id}"
            
            return {
                'user_id': user_id,
                'username': username,
                'entries': feed.entries
            }
        except Exception as e:
            return None

    def process_entry(self, entry: Dict, username: str) -> Dict:
        try:
            soup = BeautifulSoup(entry.get('description', ''), 'html.parser')
            
            # 移除 img 和 video 标签
            for tag in soup(['img', 'video']):
                tag.decompose()
            
            # 提取每个 <a> 标签的文本，并单独成一行
            content = []
            for a_tag in soup.find_all('a'):
                a_text = a_tag.get_text().strip()
                if a_text:
                    content.append(a_text)
                a_tag.decompose()  # 移除 a 标签，避免重复
            
            # 提取剩余的文本，并按段落分隔
            remaining_text = soup.get_text().strip()
            if remaining_text:
                # 按自然段落分隔
                paragraphs = remaining_text.split('\n')
                paragraphs = [p.strip() for p in paragraphs if p.strip()]
                content.extend(paragraphs)
            
            # 合并内容，每行一个字符串，用换行符分隔
            content = '\n'.join(content)
            
            published = entry.get('published', '')
            try:
                published_time = parse(published).astimezone(self.beijing_tz)
            except ValueError:
                published_time = datetime.now(self.beijing_tz)
            
            return {
                'title': username,
                'link': entry.get('link', ''),
                'content': content,
                'published': published_time.strftime('%Y-%m-%d %H:%M:%S'),
                'published_time': published_time
            }
        except Exception as e:
            return None    

    def generate_html(self, users: List[Dict]) -> str:
        template_str = '''
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>微博内容汇总</title>
            <link rel="stylesheet" href="lasteststyles.css">
        </head>
        <body>
            <div class="container">
                <div class="left-sidebar">
                    <ul>
                        {% for user in users %}
                        <li class="username" data-user="{{ user.username }}">{{ user.username }}</li>
                        {% endfor %}
                    </ul>
                </div>
                <div class="right-content">
                    {% for user in users %}
                    <div id="{{ user.username }}-content" class="content hidden">
                        {% for entry in user.entries %}
                        <div class="weibo-card">
                            <div class="weibo-header">
                                <span class="time">{{ entry.published }}</span>
                            </div>
                            <div class="content">
                                {{ entry.content }}
                            </div>
                            <a href="{{ entry.link }}" class="link" target="_blank">查看原文</a>
                        </div>
                        {% endfor %}
                    </div>
                    {% endfor %}
                </div>
            </div>
            <script src="cardscript.js"></script>
        </body>
        </html>
        '''
        template = Environment().from_string(template_str)
        return template.render(
            users=users,
            current_time=datetime.now(self.beijing_tz).strftime('%Y-%m-%d %H:%M:%S')
        )

    def crawl(self):
        try:
            os.makedirs(self.config['output_dir'], exist_ok=True)
            all_users = []
            hours_ago = self.config.get('hours_ago', 12)
            max_entries = self.config.get('max_entries_per_user', 10)
            time_threshold = datetime.now(self.beijing_tz) - timedelta(hours=hours_ago)
            
            with ThreadPoolExecutor(max_workers=5) as executor:
                future_to_user = {
                    executor.submit(self.fetch_user_info, user_id): user_id 
                    for user_id in self.config['user_ids']
                }
                
                for future in as_completed(future_to_user):
                    user_data = future.result()
                    if user_data:
                        username = user_data['username']
                        entries = []
                        for entry in user_data['entries'][:max_entries]:
                            processed_entry = self.process_entry(entry, username)
                            if processed_entry:
                                published_time = processed_entry['published_time']
                                if published_time >= time_threshold:
                                    entries.append(processed_entry)
                        all_users.append({
                            'username': username,
                            'entries': entries
                        })
            
            html_content = self.generate_html(all_users)
            output_file = os.path.join(self.config['output_dir'], 'latest.html')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            return output_file
        except Exception as e:
            raise



if __name__ == "__main__":
    try:
        crawler = WeiboRSSCrawler()
        output_file = crawler.crawl()
        print(f"微博内容已保存到: {output_file}")
    except Exception as e:
        pass

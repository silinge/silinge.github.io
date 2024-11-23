import requests
from datetime import datetime, timedelta
import pytz
import json
import os
from dateutil.parser import parse
from jinja2 import Environment, Template
from bs4 import BeautifulSoup
import feedparser
import logging
from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor, as_completed
import time

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('weibo_crawler.log', encoding='utf-8'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class WeiboRSSCrawler:
    def __init__(self, config_file: str = 'config.json'):
        self.config_file = config_file
        self.config = self.load_config()
        self.beijing_tz = pytz.timezone('Asia/Shanghai')
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        
    def load_config(self) -> Dict:
        """加载配置文件"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                # 默认配置
                default_config = {
                    "user_ids": [
                        # 在这里添加更多用户ID
                        '1694917363', 
                    ],
                    "hours_ago": 12,
                    "max_entries_per_user": 10,
                    "output_dir": "output",
                    "rsshub_base_url": "https://rsshub.app"
                }
                # 保存默认配置
                os.makedirs(os.path.dirname(self.config_file), exist_ok=True)
                with open(self.config_file, 'w', encoding='utf-8') as f:
                    json.dump(default_config, f, indent=4, ensure_ascii=False)
                return default_config
        except Exception as e:
            logger.error(f"加载配置文件失败: {e}")
            raise

    def fetch_user_info(self, user_id: str) -> Dict:
        """获取用户信息"""
        try:
            url = f"{self.config['rsshub_base_url']}/weibo/user/{user_id}"
            response = requests.get(url, headers=self.headers, timeout=10)
            feed = feedparser.parse(response.content)
            
            if feed.entries:
                # 从第一条微博中提取用户名
                first_entry = feed.entries[0]
                soup = BeautifulSoup(first_entry.get('description', ''), 'html.parser')
                author = soup.find(class_='author') or soup.find(class_='username')
                username = author.get_text().strip() if author else f"User_{user_id}"
                
                return {
                    'user_id': user_id,
                    'username': username,
                    'entries': feed.entries
                }
            return None
        except Exception as e:
            logger.error(f"获取用户 {user_id} 信息失败: {e}")
            return None

    def process_entry(self, entry: Dict, username: str) -> Dict:
        """处理单条微博内容"""
        try:
            soup = BeautifulSoup(entry.get('description', ''), 'html.parser')
            
            # 提取微博正文
            content = soup.get_text().strip()
            
            # 提取图片链接
            images = [img['src'] for img in soup.find_all('img') if 'src' in img.attrs]
            
            # 处理发布时间
            published = entry.get('published', '')
            try:
                published_time = parse(published).astimezone(self.beijing_tz)
            except ValueError:
                published_time = datetime.now(self.beijing_tz)
            
            return {
                'title': username,
                'link': entry.get('link', ''),
                'content': content,
                'images': images,
                'published': published_time.strftime('%Y-%m-%d %H:%M:%S'),
                'published_time': published_time
            }
        except Exception as e:
            logger.error(f"处理微博内容失败: {e}")
            return None

    def generate_html(self, entries: List[Dict]) -> str:
        """生成HTML页面"""
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
    <div class="header">
        <h1>微博内容汇总</h1>
        <p>更新时间: {{ current_time }}</p>
    </div>
    {% for entry in entries %}
    <div class="weibo-card">
        <div class="weibo-header">
            <span class="author">{{ entry.title }}</span>
            <span class="time">{{ entry.published }}</span>
        </div>
        <div class="content">{{ entry.content }}</div>
        {% if entry.images %}
        <div class="images">
            {% for image in entry.images %}
            <img src="{{ image }}" alt="微博图片">
            {% endfor %}
        </div>
        {% endif %}
        <a href="{{ entry.link }}" class="link" target="_blank">查看原文</a>
    </div>
    {% endfor %}
</body>
</html>
        '''
        template = Environment().from_string(template_str)
        return template.render(
            entries=entries,
            current_time=datetime.now(self.beijing_tz).strftime('%Y-%m-%d %H:%M:%S')
        )

    def crawl(self):
        """主要抓取流程"""
        try:
            # 创建输出目录
            os.makedirs(self.config['output_dir'], exist_ok=True)
            
            all_entries = []
            hours_ago = self.config.get('hours_ago', 12)
            max_entries = self.config.get('max_entries_per_user', 10)
            time_threshold = datetime.now(self.beijing_tz) - timedelta(hours=hours_ago)

            # 使用线程池并发获取数据
            with ThreadPoolExecutor(max_workers=5) as executor:
                future_to_user = {
                    executor.submit(self.fetch_user_info, user_id): user_id 
                    for user_id in self.config['user_ids']
                }

                for future in as_completed(future_to_user):
                    user_id = future_to_user[future]
                    try:
                        user_data = future.result()
                        if user_
                            username = user_data['username']
                            
                            # 处理该用户的所有微博
                            for entry in user_data['entries'][:max_entries]:
                                processed_entry = self.process_entry(entry, username)
                                if processed_entry:
                                    published_time = processed_entry['published_time']
                                    if published_time >= time_threshold:
                                        all_entries.append(processed_entry)
                    except Exception as e:
                        logger.error(f"处理用户 {user_id} 数据失败: {e}")

            # 按时间排序
            all_entries.sort(key=lambda x: x['published_time'], reverse=True)

            # 生成HTML文件
            html_content = self.generate_html(all_entries)
            output_file = os.path.join(self.config['output_dir'], 'rss/latest.html')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)

            #logger.info(f"成功生成微博汇总，共 {len(all_entries)} 条内容")
            return output_file

        except Exception as e:
            logger.error(f"抓取过程发生错误: {e}")
            raise

if __name__ == "__main__":
    try:
        crawler = WeiboRSSCrawler()
        output_file = crawler.crawl()
        print(f"微博内容已保存到: {output_file}")
    except Exception as e:
        logger.error(f"程序执行失败: {e}")

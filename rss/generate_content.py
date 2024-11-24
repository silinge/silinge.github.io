import os
import json
import requests
from datetime import datetime, timedelta
from dateutil.parser import parse
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from jinja2 import Environment, FileSystemLoader
import pytz
import feedparser


class WeiboRSSCrawler:
    def __init__(self, config_file: str = 'rss/config.json'):
        """初始化爬虫配置"""
        self.config_file = config_file
        self.config = self.load_config()
        self.beijing_tz = pytz.timezone('Asia/Shanghai')
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        self.template_dir = 'templates'

    def load_config(self) -> Dict:
        """加载配置文件，如果不存在则生成默认配置"""
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                default_config = {
                    "user_ids": ["1694917363"],
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
            print(f"加载配置文件失败: {e}")
            raise

    def fetch_user_info(self, user_id: str) -> Optional[Dict]:
        """获取用户 RSS 信息"""
        try:
            url = f"{self.config['rsshub_base_url']}/weibo/user/{user_id}"
            response = requests.get(url, headers=self.headers, timeout=10)
            feed = feedparser.parse(response.content)

            username = feed.feed.title if 'title' in feed.feed else f"User_{user_id}"
            return {
                'user_id': user_id,
                'username': username,
                'entries': feed.entries
            }
        except Exception as e:
            print(f"获取用户 {user_id} 信息失败: {e}")
            return None

    def process_entry(self, entry: Dict, username: str) -> Optional[Dict]:
        """处理 RSS 条目内容"""
        try:
            soup = BeautifulSoup(entry.get('description', ''), 'html.parser')
            for tag in soup(['img', 'video', 'script']):
                tag.decompose()

            content = soup.get_text(separator='\n').strip()
            published_time = self.parse_date(entry.get('published', ''))

            return {
                'title': username,
                'link': entry.get('link', ''),
                'content': content,
                'published': published_time.strftime('%Y-%m-%d %H:%M:%S'),
                'published_time': published_time
            }
        except Exception as e:
            print(f"处理条目失败: {e}")
            return None

    def parse_date(self, date_str: str) -> datetime:
        """解析日期字符串"""
        try:
            return parse(date_str).astimezone(self.beijing_tz)
        except Exception:
            return datetime.now(self.beijing_tz)

    def generate_html(self, users: List[Dict]) -> str:
        """生成 HTML 内容"""
        env = Environment(loader=FileSystemLoader(os.path.join(os.getcwd(), 'rss')))
        template = env.get_template('weibo_template.html')
        return template.render(
            users=users,
            current_time=datetime.now(self.beijing_tz).strftime('%Y-%m-%d %H:%M:%S')
        )

    def crawl(self) -> str:
        """爬取并生成 HTML 文件"""
        try:
            os.makedirs(self.config['output_dir'], exist_ok=True)
            all_users = []
            hours_ago = self.config.get('hours_ago', 12)
            max_entries = self.config.get('max_entries_per_user', 10)
            time_threshold = datetime.now(self.beijing_tz) - timedelta(hours=hours_ago)

            with ThreadPoolExecutor(max_workers=min(len(self.config['user_ids']), 5)) as executor:
                futures = {
                    executor.submit(self.fetch_user_info, user_id): user_id
                    for user_id in self.config['user_ids']
                }

                for future in as_completed(futures):
                    user_data = future.result()
                    if user_data:
                        username = user_data['username']
                        entries = [
                            self.process_entry(entry, username)
                            for entry in user_data['entries'][:max_entries]
                            if self.process_entry(entry, username) and
                            self.process_entry(entry, username)['published_time'] >= time_threshold
                        ]
                        all_users.append({
                            'username': username,
                            'entries': entries
                        })

            html_content = self.generate_html(all_users)
            output_file = os.path.join(self.config['output_dir'], 'latest.html')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)
            print(f"微博内容已保存到: {output_file}")
            return output_file
        except Exception as e:
            print(f"爬取失败: {e}")
            raise


if __name__ == "__main__":
    try:
        crawler = WeiboRSSCrawler()
        output_file = crawler.crawl()
    except Exception as e:
        print(f"主程序异常: {e}")

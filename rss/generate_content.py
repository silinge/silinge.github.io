import os
import json
import requests
from datetime import datetime, timedelta
import pytz
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor, as_completed
from dateutil.parser import parse
import feedparser

class WeiboRSSCrawler:
    def __init__(self, config_file='rss/config.json'):
        self.config_file = config_file
        self.config = self.load_config()
        self.beijing_tz = pytz.timezone('Asia/Shanghai')
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }

    def load_config(self):
        try:
            if os.path.exists(self.config_file):
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                default_config = {
                    "user_ids": [],
                    "hours_ago": 12,
                    "max_entries_per_user": 10,
                    "output_dir": "rss",
                    "rsshub_base_url": "https://rsshub.app",
                    "max_concurrent_requests": 5,
                    "retry_attempts": 3
                }
                os.makedirs(os.path.dirname(self.config_file), exist_ok=True)
                with open(self.config_file, 'w', encoding='utf-8') as f:
                    json.dump(default_config, f, indent=4, ensure_ascii=False)
                print("Default config created. Please update user_ids.")
                return default_config
        except Exception as e:
            print(f"Error loading config: {e}")
            raise

    def fetch_user_info(self, user_id, retry_attempts):
        url = f"{self.config['rsshub_base_url']}/weibo/user/{user_id}"
        for attempt in range(retry_attempts):
            try:
                print(f"Fetching data for user: {user_id} (Attempt {attempt + 1})")
                response = requests.get(url, headers=self.headers, timeout=10)
                response.raise_for_status()
                feed = feedparser.parse(response.content)
                username = feed.feed.get('title', f"User_{user_id}")
                return {
                    'user_id': user_id,
                    'username': username,
                    'entries': feed.entries
                }
            except Exception as e:
                print(f"Error fetching user {user_id}: {e}")
                if attempt + 1 == retry_attempts:
                    print(f"Failed to fetch data for user {user_id} after {retry_attempts} attempts.")
        return None

    def process_entry(self, entry, username):
        try:
            soup = BeautifulSoup(entry.get('description', ''), 'html.parser')
            for tag in soup(['img', 'video']):
                tag.decompose()
            content = '\n'.join(
                [a.get_text(strip=True) for a in soup.find_all('a')] +
                [p.strip() for p in soup.get_text(strip=True).split('\n') if p.strip()]
            )
            published_time = parse(entry.get('published', '')).astimezone(self.beijing_tz)
            return {
                'title': username,
                'link': entry.get('link', ''),
                'content': content,
                'published': published_time.strftime('%Y-%m-%d %H:%M:%S'),
                'published_time': published_time
            }
        except Exception as e:
            print(f"Error processing entry: {e}")
            return None

    def generate_html(self, users):
        try:
            template_dir = self.config.get('output_dir', '.')
            env = Environment(loader=FileSystemLoader(template_dir))
            template = env.get_template('weibo_template.html')
            return template.render(users=users)
        except Exception as e:
            print(f"Error generating HTML: {e}")
            raise

    def crawl(self):
        try:
            os.makedirs(self.config['output_dir'], exist_ok=True)
            users = []
            failed_users = []
            hours_ago = self.config.get('hours_ago', 12)
            max_entries = self.config.get('max_entries_per_user', 10)
            time_threshold = datetime.now(self.beijing_tz) - timedelta(hours=hours_ago)
            max_concurrent_requests = self.config.get('max_concurrent_requests', 5)
            retry_attempts = self.config.get('retry_attempts', 3)

            with ThreadPoolExecutor(max_workers=max_concurrent_requests) as executor:
                futures = {
                    executor.submit(self.fetch_user_info, user_id, retry_attempts): user_id
                    for user_id in self.config['user_ids']
                }
                for future in as_completed(futures):
                    user_data = future.result()
                    if user_data:
                        entries = [
                            self.process_entry(entry, user_data['username'])
                            for entry in user_data['entries'][:max_entries]
                            if parse(entry.get('published', '')).astimezone(self.beijing_tz) >= time_threshold
                        ]
                        users.append({'username': user_data['username'], 'entries': entries})
                    else:
                        failed_users.append(futures[future])

            if not users:
                print("No data fetched for any user.")
                return None

            html_content = self.generate_html(users)
            output_file = os.path.join(self.config['output_dir'], 'latest.html')
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(html_content)

            print(f"HTML successfully saved to {output_file}")
            if failed_users:
                print(f"Failed to fetch data for the following users: {', '.join(failed_users)}")
            return output_file
        except Exception as e:
            print(f"Error during crawl: {e}")
            raise

if __name__ == "__main__":
    crawler = WeiboRSSCrawler()
    result = crawler.crawl()
    if result:
        print(f"HTML generated at: {result}")
    else:
        print("No HTML generated.")

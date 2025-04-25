import os
import json
import re

# 定义文件路径
markdown_folder = 'markdown'
prompts_json_file = 'prompts.json'

def update_prompts_json():
    """扫描markdown文件夹，更新prompts.json文件"""
    # 获取markdown文件夹中的所有md文件
    md_files = []
    for file in os.listdir(markdown_folder):
        if file.endswith('.md') and file != 'example.md':
            md_files.append(file)
    
    # 创建新的prompts数组
    prompts = []
    for md_file in md_files:
        # 使用文件名作为标题（去掉.md扩展名）
        title = os.path.splitext(md_file)[0]
        # 创建prompts条目
        prompt = {
            "title": title,
            "content": f"{markdown_folder}/{md_file}"
        }
        prompts.append(prompt)
    
    # 将prompts数组写入prompts.json文件
    with open(prompts_json_file, 'w', encoding='utf-8') as f:
        json.dump(prompts, f, ensure_ascii=False, indent=2)
    
    print(f"已更新 {prompts_json_file}，共添加了 {len(prompts)} 个提示词。")

if __name__ == "__main__":
    update_prompts_json()
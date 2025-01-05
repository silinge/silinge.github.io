import re
import json

def extract_user_ids(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 使用正则表达式提取 /u/ 后面的数字
    user_ids = re.findall(r'/u/(\d+)', content)

    # 去重
    unique_user_ids = list(set(user_ids))

    # 按数字大小排序（可选）
    unique_user_ids.sort(key=lambda x: int(x))

    # 导出到 JSON 文件
    result = {"user_ids": unique_user_ids}
    with open('result.json', 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=2)

    print(f"提取完成，共找到 {len(unique_user_ids)} 个唯一用户 ID，已保存到 result.json")

# 调用函数处理 origin.md
extract_user_ids('origin.md')
import json

# 读取原始文本文件
with open(r'E:\silinge.github.io\article\pythontools\example.txt', 'r', encoding='utf-8') as f:
    original_text = f.read()

# 创建包含文本数据的字典
data = {"content": original_text}

# 将数据写入JSON文件（自动处理特殊字符转义）
with open(r'E:\silinge.github.io\article\pythontools\output.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 若要直接获取转义后的字符串（不生成完整JSON文件）

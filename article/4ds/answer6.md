以下是Python程序代码，用于将带有标点符号的文本转换为JSON兼容格式：

```python
import json

# 读取原始文本文件
with open('example.txt', 'r', encoding='utf-8') as f:
    original_text = f.read()

# 创建包含文本数据的字典
data = {"content": original_text}

# 将数据写入JSON文件（自动处理特殊字符转义）
with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 若要直接获取转义后的字符串（不生成完整JSON文件）
escaped_text = json.dumps(original_text)
print("转义后的文本字符串:", escaped_text)
```

**代码说明：**

1. **读取文件**：使用`utf-8`编码读取原始文本，确保兼容各种语言字符
2. **自动转义**：`json.dump`和`json.dumps`会自动处理以下转义：
   - 双引号 `"` → `\"`
   - 反斜杠 `\` → `\\`
   - 控制字符（如换行符`\n`、制表符`\t`等）
   - Unicode字符（当`ensure_ascii=True`时转为`\uXXXX`格式）
3. **参数说明**：
   - `ensure_ascii=False`：保留非ASCII字符原样输出
   - `indent=2`：生成美观格式的JSON（生产环境可移除以减小文件体积）

**使用示例：**

原始文本（example.txt）：
```
你好，"世界"！
特殊符号：\ / {} []
换行测试：第一行
第二行
```

生成的JSON（output.json）：
```json
{
  "content": "你好，\"世界\"！\n特殊符号：\\ / {} []\n换行测试：第一行\n第二行"
}
```

**注意事项：**
1. 如果文本包含JSON保留字符（如`{}[]`），在作为纯字符串存储时不需要额外处理
2. 如需将整个文本文件作为独立JSON字符串使用，可以直接使用`json.dumps(original_text)`
3. 处理超大文件时建议使用流式处理（逐行读取）以避免内存问题

这种方法可以确保文本中的所有特殊符号都能正确转换为JSON兼容格式，同时保持最佳的可读性和兼容性。
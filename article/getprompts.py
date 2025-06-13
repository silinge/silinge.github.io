import os
import pandas as pd

# 遍历当前文件夹
for filename in os.listdir('.'):
    if filename.lower().endswith(('.xls', '.xlsx')):
        # 读取Excel文件所有工作表
        xls = pd.ExcelFile(filename)
        # 每个Excel文件生成一个.md文件
        md_filename = os.path.splitext(filename)[0] + '.md'
        with open(md_filename, 'w', encoding='utf-8') as f:
            for sheet_name in xls.sheet_names:
                df = pd.read_excel(filename, sheet_name=sheet_name)
                # 遍历所有单元格，提取非空内容并写入Markdown
                for _, row in df.iterrows():
                    for val in row:
                        if pd.notna(val):  # 只要不是空值，都认为是文本或数字
                            f.write(f"{val}\n")

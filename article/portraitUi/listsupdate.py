import os

def update_lists():
    # 获取lists文件夹的路径
    lists_dir = os.path.join(os.path.dirname(__file__), 'lists')
    available_lists_path = os.path.join(os.path.dirname(__file__), 'available_lists.txt')
    
    try:
        # 获取所有.txt文件
        list_files = [f for f in os.listdir(lists_dir) if f.endswith('_list.txt')]
        
        # 过滤掉gender_list.txt和age_list.txt
        list_files = [f for f in list_files if f not in ['gender_list.txt', 'age_list.txt']]
        
        # 按字母顺序排序文件列表
        list_files.sort()
        
        # 将文件列表写入available_lists.txt
        with open(available_lists_path, 'w', encoding='utf-8') as f:
            f.write('\n'.join(list_files))
            
        print(f'成功更新available_lists.txt，共包含{len(list_files)}个列表文件')
        
    except Exception as e:
        print(f'更新列表文件时发生错误: {str(e)}')

if __name__ == '__main__':
    update_lists()
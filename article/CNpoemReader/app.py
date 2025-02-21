import json
import gradio as gr
from gtts import gTTS
import os
import time

# 加载 JSON 数据
def load_poems():
    start_time = time.time()
    with open('poet.tang.50000.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f"加载数据耗时: {time.time() - start_time:.2f}秒")  # 调试输出
    return data['strains']  # 确保返回的是诗歌列表

# 根据关键词查找诗歌
def search_poems(keyword):
    poems = load_poems()
    results = []
    keyword = keyword.lower()
    print(f"搜索关键词: {keyword}")  # 调试输出
    start_time = time.time()
    
    # 使用列表推导式进行搜索
    results = [poem for poem in poems if keyword in poem['title'].lower()]
    
    print(f"搜索耗时: {time.time() - start_time:.2f}秒")  # 调试输出
    print(f"找到的结果数量: {len(results)}")  # 调试输出
    return results[:5]  # 返回前五项

# 生成朗读语音
def generate_audio(selected_poem):
    tts = gTTS(text=' '.join(selected_poem['paragraphs']), lang='zh')  # 修复了这里
    audio_file = 'output.mp3'
    tts.save(audio_file)
    return audio_file

# Gradio 界面
def main(keyword, selected_poem):
    if selected_poem:
        return generate_audio(selected_poem)
    else:
        results = search_poems(keyword)
        return results

# 创建 Gradio 界面
with gr.Blocks() as demo:
    keyword_input = gr.Textbox(placeholder="输入关键词搜索诗歌标题")
    search_button = gr.Button("搜索")
    poem_selection = gr.Radio(label="选择诗歌", choices=[], type="value")
    audio_output = gr.Audio(label="朗读音频")

    def update_poem_selection(keyword):
        results = search_poems(keyword)
        return [poem['title'] for poem in results]

    search_button.click(fn=update_poem_selection, inputs=keyword_input, outputs=poem_selection)
    poem_selection.change(fn=main, inputs=[keyword_input, poem_selection], outputs=audio_output)

# 启动应用
demo.launch()

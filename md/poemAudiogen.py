import os
import gradio as gr
import numpy as np
import zipfile
import shutil
import glob

# 创建输出目录
os.makedirs("outputs", exist_ok=True)

# 设置自定义模型目录
CUSTOM_MODEL_DIR = "models"
os.makedirs(CUSTOM_MODEL_DIR, exist_ok=True)

# 设置 PaddleSpeech 模型缓存目录
home_dir = os.path.expanduser("~")
paddle_home = os.path.join(home_dir, ".paddlespeech")
model_cache_dir = os.path.join(paddle_home, "models")

# 创建缓存目录
os.makedirs(model_cache_dir, exist_ok=True)

# 解压并复制模型文件到 PaddleSpeech 缓存目录
def prepare_model(zip_file, model_name, target_dir):
    """解压模型并准备目录结构"""
    if not os.path.exists(zip_file):
        print(f"警告: 未找到模型文件 {zip_file}")
        return False
    
    # 临时解压目录
    temp_dir = os.path.join(CUSTOM_MODEL_DIR, "temp")
    os.makedirs(temp_dir, exist_ok=True)
    
    # 解压模型
    try:
        with zipfile.ZipFile(zip_file, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        print(f"模型 {zip_file} 解压成功")
        
        # 找到解压后的模型目录
        extracted_dirs = glob.glob(os.path.join(temp_dir, "*"))
        if not extracted_dirs:
            print(f"解压后未找到任何文件")
            return False
        
        # 创建目标目录
        os.makedirs(target_dir, exist_ok=True)
        
        # 复制文件到目标目录
        for src in extracted_dirs:
            if os.path.isdir(src):
                # 复制目录内容
                for item in os.listdir(src):
                    s = os.path.join(src, item)
                    d = os.path.join(target_dir, item)
                    if os.path.isdir(s):
                        shutil.copytree(s, d, dirs_exist_ok=True)
                    else:
                        shutil.copy2(s, d)
            else:
                # 复制文件
                shutil.copy2(src, target_dir)
        
        print(f"模型文件已复制到 {target_dir}")
        return True
    except Exception as e:
        print(f"处理模型时出错: {str(e)}")
        return False
    finally:
        # 清理临时目录
        if os.path.exists(temp_dir):
            shutil.rmtree(temp_dir)

print("正在准备模型...")

# 准备 pwgan_csmsc 模型 (中文基础女声)
pwgan_csmsc_zip = "pwg_baker_ckpt_0.4.zip"
pwgan_csmsc_dir = os.path.join(model_cache_dir, "pwgan", "pwgan_csmsc")
prepare_model(pwgan_csmsc_zip, "pwgan_csmsc", pwgan_csmsc_dir)

# 准备 pwgan_aishell3 模型 (中文多发言人)
pwgan_aishell3_zip = "pwg_aishell3_ckpt_0.5.zip"
pwgan_aishell3_dir = os.path.join(model_cache_dir, "pwgan", "pwgan_aishell3")
prepare_model(pwgan_aishell3_zip, "pwgan_aishell3", pwgan_aishell3_dir)

# 准备 pwgan_ljspeech 模型 (英文女声)
pwgan_ljspeech_zip = "pwg_ljspeech_ckpt_0.5.zip"
pwgan_ljspeech_dir = os.path.join(model_cache_dir, "pwgan", "pwgan_ljspeech")
prepare_model(pwgan_ljspeech_zip, "pwgan_ljspeech", pwgan_ljspeech_dir)

# 准备 pwgan_vctk 模型 (英文多发言人)
pwgan_vctk_zip = "pwg_vctk_ckpt_0.5.zip"
pwgan_vctk_dir = os.path.join(model_cache_dir, "pwgan", "pwgan_vctk")
prepare_model(pwgan_vctk_zip, "pwgan_vctk", pwgan_vctk_dir)

# 导入 PaddleSpeech
print("正在加载 PaddleSpeech...")
from paddlespeech.cli.tts.infer import TTSExecutor

# 初始化 TTS 执行器
tts = TTSExecutor()

print("模型加载完成！")

# 定义语音角色配置
# 定义语音角色配置
VOICE_CONFIGS = {
    # 中文角色 - 使用 pwg_baker_ckpt_0.4.zip
    "中文女声 (流畅)": {
        "am": "speedyspeech_csmsc", 
        "voc": "pwgan_csmsc",
        "lang": "zh",
        "spk_id": 0
    },
    "中文女声 (标准)": {
        "am": "fastspeech2_csmsc", 
        "voc": "pwgan_csmsc",
        "lang": "zh",
        "spk_id": 0
    },
    
    # 中文多角色 - 使用 pwg_aishell3_ckpt_0.5.zip
    "中文男声 (磁性)": {
        "am": "fastspeech2_aishell3", 
        "voc": "pwgan_aishell3",
        "lang": "zh",
        "spk_id": 0  # 男声
    },
    "中文女声 (温柔)": {
        "am": "fastspeech2_aishell3", 
        "voc": "pwgan_aishell3",
        "lang": "zh",
        "spk_id": 1  # 女声1
    },
    "中文女声 (活泼)": {
        "am": "fastspeech2_aishell3", 
        "voc": "pwgan_aishell3",
        "lang": "zh",
        "spk_id": 2  # 女声2
    },
    "中文女声 (沉稳)": {
        "am": "fastspeech2_aishell3", 
        "voc": "pwgan_aishell3",
        "lang": "zh",
        "spk_id": 3  # 女声3
    },
    "中文男声 (年轻)": {
        "am": "fastspeech2_aishell3", 
        "voc": "pwgan_aishell3",
        "lang": "zh",
        "spk_id": 4  # 男声2
    },
    
    # 英文角色 - 使用 pwg_ljspeech_ckpt_0.5.zip
    "英文女声 (美式)": {
        "am": "fastspeech2_ljspeech", 
        "voc": "pwgan_ljspeech",
        "lang": "en",
        "spk_id": 0
    },
    
    # 英文多角色 - 使用 pwg_vctk_ckpt_0.5.zip
    "英文男声 (美式)": {
        "am": "fastspeech2_vctk", 
        "voc": "pwgan_vctk",
        "lang": "en",
        "spk_id": 0  # p225 - 男声
    },
    "英文女声 (英式1)": {
        "am": "fastspeech2_vctk", 
        "voc": "pwgan_vctk",
        "lang": "en",
        "spk_id": 1  # p226 - 英式女声
    },
    "英文女声 (英式2)": {
        "am": "fastspeech2_vctk", 
        "voc": "pwgan_vctk",
        "lang": "en",
        "spk_id": 2  # p227 - 英式女声
    },
    "英文男声 (英式)": {
        "am": "fastspeech2_vctk", 
        "voc": "pwgan_vctk",
        "lang": "en",
        "spk_id": 3  # p228 - 英式男声
    },
    "英文女声 (美式2)": {
        "am": "fastspeech2_vctk", 
        "voc": "pwgan_vctk",
        "lang": "en",
        "spk_id": 4  # p229 - 美式女声
    },
    "英文男声 (美式2)": {
        "am": "fastspeech2_vctk", 
        "voc": "pwgan_vctk",
        "lang": "en",
        "spk_id": 5  # p230 - 美式男声
    },
}

def text_to_speech_with_role(text, voice_role, speed=1.0, volume=1.0):
    """
    使用选定的语音角色将文本转换为语音
    
    参数:
        text (str): 要转换的文本
        voice_role (str): 语音角色
        speed (float): 语速
        volume (float): 音量
        
    返回:
        tuple: (生成的音频文件路径, 状态信息)
    """
    if not text:
        return None, "请输入文本"
    
    # 限制文本长度
    max_length = 300
    if len(text) > max_length:
        text = text[:max_length] + "..."
    
    # 创建输出文件路径
    output_file = os.path.join("outputs", f"output_{np.random.randint(10000)}.wav")
    
    try:
        # 获取选定角色的配置
        if voice_role in VOICE_CONFIGS:
            config = VOICE_CONFIGS[voice_role]
        else:
            # 默认使用中文女声
            config = VOICE_CONFIGS["中文女声 (流畅)"]
        
        # 调用 TTS - 移除 speed 和 volume 参数
        tts(
            text=text,
            output=output_file,
            am=config["am"],
            voc=config["voc"],
            lang=config["lang"],
            spk_id=config["spk_id"]
            # 移除 speed 和 volume 参数，因为不被支持
        )
        
        return output_file, f"成功生成语音：{voice_role}"
    except Exception as e:
        error_msg = str(e)
        print(f"生成失败: {error_msg}")
        
        # 如果是模型下载错误，提供友好提示
        if "Download" in error_msg and "failed" in error_msg:
            status = f"模型下载失败，请确保已手动上传并解压 {config['am']} 和 {config['voc']} 模型文件"
        else:
            status = f"生成失败: {error_msg}"
        
        return None, status

# 创建 Gradio 界面
with gr.Blocks(title="PaddleSpeech 多角色语音合成") as demo:
    gr.Markdown("# PaddleSpeech 多角色语音合成")
    gr.Markdown("使用本地模型将文本转换为不同角色的语音")
    
    with gr.Row():
        with gr.Column():
            text_input = gr.Textbox(
                placeholder="请输入要转换的文本...", 
                label="输入文本 (建议不超过 300 字)",
                lines=5
            )
            
            voice_role = gr.Dropdown(
                list(VOICE_CONFIGS.keys()),
                label="选择语音角色",
                value="中文女声 (流畅)"
            )
            
            with gr.Row():
                speed = gr.Slider(
                    minimum=0.7, 
                    maximum=1.5, 
                    value=1.0, 
                    step=0.1, 
                    label="语速 (0.7-1.5) [注: 当前版本不支持语速调整]"
                )
                volume = gr.Slider(
                    minimum=0.7, 
                    maximum=1.5, 
                    value=1.0, 
                    step=0.1, 
                    label="音量 (0.7-1.5) [注: 当前版本不支持音量调整]"
                )
                
            convert_btn = gr.Button("生成语音", variant="primary")
        
        with gr.Column():
            audio_output = gr.Audio(label="生成的语音")
            status_output = gr.Textbox(label="状态信息", visible=True)
    
    convert_btn.click(
        text_to_speech_with_role, 
        inputs=[text_input, voice_role, speed, volume], 
        outputs=[audio_output, status_output]
    )
    
    gr.Markdown("## 示例")
    
    gr.Examples(
        [
            ["今天天气真不错，我很开心。", "中文女声 (流畅)", 1.0, 1.0],
            ["人工智能正在改变我们的生活方式。", "中文男声", 1.0, 1.0],
            ["春天来了，花儿开放，小鸟歌唱。", "中文女声 (温柔)", 0.9, 1.0],
            ["Artificial intelligence is changing our life.", "英文女声", 1.0, 1.0],
            ["Hello world! Nice to meet you.", "英文男声", 1.0, 1.0]
        ],
        inputs=[text_input, voice_role, speed, volume]
    )
    
    gr.Markdown("""
    ## 注意事项
    
    1. 首次使用某个语音角色时，系统会下载相应的模型，可能需要等待一段时间
    2. 如果模型下载失败，请手动下载对应模型并上传到 Space
    3. 当前版本不支持语速和音量调整，滑块仅作为参考
    """)

# 启动应用
if __name__ == "__main__":
    demo.launch(share=True)  # 设置 share=True 创建公共链接
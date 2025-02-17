要将视频文件与三个配音合并为一个支持多音轨切换的文件，可以按以下步骤操作：

---

### 方案一：使用 **MKV 容器**（推荐）
**MKV格式**天然支持多音轨/多字幕，且兼容主流播放器（如VLC、PotPlayer）。

#### 工具选择：
1. **FFmpeg**（命令行工具，高效灵活）
2. **MKVToolNix GUI**（图形界面工具，操作简单）

---

### 方法1：通过 **FFmpeg** 实现
1. **安装FFmpeg**  
   [官网下载](https://ffmpeg.org) 后配置环境变量。

2. **合并音视频**  
   执行以下命令（需替换文件路径）：
   ```bash
   ffmpeg -i 视频A.mp4 -i 配音1.mp3 -i 配音2.mp3 -i 配音3.mp3 \
          -map 0:v -map 0:a? -map 1:a -map 2:a -map 3:a \
          -metadata:s:a:0 title="原始音频" -metadata:s:a:0 language=chi \
          -metadata:s:a:1 title="配音1" -metadata:s:a:1 language=eng \
          -metadata:s:a:2 title="配音2" -metadata:s:a:2 language=jpn \
          -metadata:s:a:3 title="配音3" -metadata:s:a:3 language=kor \
          -c:v copy -c:a aac -b:a 192k 输出文件.mkv
   ```
   - `-map`：指定流映射（`0:v`=视频，`0:a`=视频自带音频，`1:a`=配音1等）
   - `-metadata`：设置音轨语言和标题（播放器可识别）
   - `-c:v copy`：直接复制视频流（无损）
   - `-c:a aac`：统一音频编码（可选保留原始格式）

---

### 方法2：通过 **MKVToolNix GUI** 实现（更简单）
1. **下载安装**  
   [官网地址](https://mkvtoolnix.download)

2. **操作步骤**：
   1. 打开软件，将视频文件拖入"输入文件"区域。
   2. 依次拖入三个配音文件。
   3. 在右侧轨道列表中：
      - 保留视频轨道，取消不需要的原始音频（若无需保留）。
      - 为每个配音设置语言标签（如Chinese、English）。
   4. 点击"开始混流"生成MKV文件。

---

### 关键注意事项：
1. **音频格式统一**  
   确保所有音频的采样率（如48kHz）、声道数（如立体声）一致，否则需用FFmpeg预处理：
   ```bash
   ffmpeg -i 输入音频.mp3 -ar 48000 -ac 2 输出音频.aac
   ```

2. **播放器测试**  
   使用VLC/PotPlayer播放生成的MKV文件，右键菜单切换音轨。

---

### 扩展方案：MP4 格式多音轨
MP4支持有限的多音轨，但需确保：
1. 所有音频为AAC编码
2. 使用以下FFmpeg命令：
   ```bash
   ffmpeg -i 视频.mp4 -i 配音1.aac -i 配音2.aac -i 配音3.aac \
          -map 0:v -map 0:a -map 1:a -map 2:a -map 3:a \
          -c:v copy -c:a copy 输出.mp4
   ```
   *注：部分播放器可能无法正确识别MP4多音轨*

---

完成后，播放时即可通过播放器的音轨切换功能选择不同配音。
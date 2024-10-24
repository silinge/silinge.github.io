以下是 Adobe Premiere Pro 常用的一些快捷键，能大大提高工作效率：

### 1. **基本操作**
- **新建项目**：`Ctrl + Alt + N`（Windows） / `Cmd + Option + N`（Mac）
- **新建序列**：`Ctrl + N`（Windows） / `Cmd + N`（Mac）
- **保存项目**：`Ctrl + S`（Windows） / `Cmd + S`（Mac）

### 2. **时间线操作**
- **播放/暂停**：`Space`
- **向前播放一帧**：`右方向键`
- **向后播放一帧**：`左方向键`
- **剪切片段（刀片工具）**：`C`
- **选择工具**：`V`
- **放大时间线**：`=`（等号）
- **缩小时间线**：`-`（减号）

### 3. **编辑**
- **剪切（切割片段）**：`Ctrl + K`（Windows） / `Cmd + K`（Mac）
- **提取剪辑**（从时间线上移除剪辑并自动合并空隙）：`Shift + Delete`
- **提升剪辑**（从时间线上移除剪辑，但保留空隙）：`Delete`
- **在入点/出点剪切到轨道头部**：`Q`
- **在入点/出点剪切到轨道尾部**：`W`

### 4. **标记**
- **添加标记**：`M`
- **设置入点**：`I`
- **设置出点**：`O`
- **清除入点/出点**：`Ctrl + Shift + X`（Windows） / `Cmd + Shift + X`（Mac）

### 5. **项目管理**
- **导入文件**：`Ctrl + I`（Windows） / `Cmd + I`（Mac）
- **导出媒体**：`Ctrl + M`（Windows） / `Cmd + M`（Mac）
  
### 6. **导航**
- **项目面板中查找**：`Ctrl + F`（Windows） / `Cmd + F`（Mac）
- **切换全屏**：`Ctrl + `（Windows） / `Cmd + `（Mac）
- **切换工作区布局**：`Shift + `（按住 Shift 键并点击切换）

这些快捷键覆盖了大部分日常编辑任务，可以帮助你更快地完成视频编辑。如果有更具体的需求，像是某些功能的快捷键，告诉我，我可以详细说明。

在 Adobe Premiere Pro 中，你可以将视频或音频片段对齐到时间线的开始（从 0 对齐）的方法如下：

### 方法 1: 手动对齐
1. **选择片段**：在时间线上，点击你想要对齐的片段。
2. **拖动到 0 秒**：将片段手动拖动到时间线的起点，确保其左边缘对齐到时间线的 0 秒刻度位置。

### 方法 2: 使用快捷键对齐
1. **选择片段**：在时间线上点击你想要对齐的片段。
2. **将播放头移动到时间线的起点**：按 `Home` 键，播放头会立即移动到时间线的 0 秒位置。
3. **对齐片段到播放头**：
   - 按 `Shift + 拖动片段`，使片段自动吸附到播放头所在的位置。
   - 确保“**吸附到播放头**”功能已启用，快捷键是 `S`，这会帮助你自动吸附到播放头或其他片段的位置。

### 方法 3: 输入精确时间码
1. **选择片段**：在时间线上点击片段。
2. **在“效果控制”面板调整位置**：打开左上角的“效果控制”面板，找到**位置**属性，修改视频片段的“X 轴”值为 `0`，确保片段左边缘对齐到时间线的 0 秒处。

### 方法 4: 使用“移动到播放头”命令
1. **将播放头移动到 0 秒位置**：按 `Home` 键，或者手动拖动播放头到时间线的起点。
2. **选择片段**：选择要对齐的片段。
3. **右键菜单选择“移动到播放头”**：右键点击片段，选择**移动到播放头**，这将自动将片段左边对齐到播放头的位置。

这几种方法都能帮你快速将轨道中的片段与 0 秒起点对齐。你可以根据自己的工作习惯选择最适合的方式。

在 Adobe Premiere Pro 中，**删除时间线中所有空隙**（即没有视频或音频的部分）可以通过以下方法快速完成：

### 方法 1: 手动删除所有空隙
1. **选择所有轨道的空隙**：
   - 按住 `Shift`，然后在时间线中点击所有空隙的区域，或者拖动鼠标框选空隙，确保选择了所有空白部分。

2. **删除空隙**：
   - 选中所有空隙后，按 `Delete` 键，空隙将被删除，剩余的片段会自动靠拢。

### 方法 2: 使用“关闭空隙”功能
Premiere Pro 有一个隐藏的命令可以自动关闭时间线中的所有空隙：

1. **选择时间线中的所有片段**：
   - 按 `Ctrl + A`（Windows）或 `Cmd + A`（Mac）来选择时间线中的所有视频和音频片段。

2. **使用序列菜单来删除空隙**：
   - 进入**序列**菜单，点击 **关闭轨道中的空隙**（**Close Gaps**）。
   - Premiere Pro 会自动删除所有空隙并将剩余的片段靠拢在一起。

### 方法 3: 使用 Ripple Delete (涟漪删除) 删除空隙
1. **选择时间线中的空隙**：
   - 在时间线上点击任何空隙区域。
   
2. **执行 Ripple Delete**：
   - 右键点击空隙，选择**Ripple Delete**，这会自动删除选定空隙，并让剩余片段无缝对接。
   - 如果时间线上有多个空隙，可以重复这个步骤，但也可以配合**Shift + 点击**来一次性选择多个空隙进行删除。

### 方法 4: 手动框选多段删除（适用于少量空隙）
1. **框选多个空隙**：
   - 按住 `Shift` 键，使用鼠标在时间线中框选多段空隙。确保空隙高亮。

2. **按 Delete 删除**：
   - 按 `Delete` 键删除所有选中的空隙。

### 小提示：
- **吸附功能（Snap）**：确保“**吸附功能**”已启用（快捷键 `S`），这样在删除空隙时，片段会自动对齐，不会产生新的间隙。
  
这些方法可以帮助你高效删除时间线中的空隙，让整个项目更加紧凑。
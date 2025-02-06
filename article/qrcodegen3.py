import qrcode
from PIL import Image

# 创建二维码对象
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=5,  # 适当减小 box_size，以便原始图像不会过大
    border=1,
)

# 添加数据
data = "https://silinge.github.io/article/whoami.html"  # 这里放入你的数据
qr.add_data(data)
qr.make(fit=True)

# 生成二维码图像
img = qr.make_image(fill_color="black", back_color="white")

# 缩放图像到 填写你想要的数值
height = 120 
width = 120
img = img.resize((height, width), Image.LANCZOS)  # 使用 LANCZOS 算法获得较好的缩放质量

# 保存图像
img.save(f"qrcode_{height}x{width}.png")
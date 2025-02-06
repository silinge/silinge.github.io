import qrcode

# 创建二维码对象
qr = qrcode.QRCode(
    version=1,  # 控制二维码大小（1-40），值越大，可存储的内容越多，但二维码也会更大更复杂
    error_correction=qrcode.constants.ERROR_CORRECT_L,  # 纠错级别
    box_size=10,  # 每个“盒子”的像素大小
    border=1,  # 边框宽度
)

# 添加数据
data = "https://silinge.github.io/article/whoami.html" # 这里放入你的数据
qr.add_data(data)
qr.make(fit=True)

# 生成二维码图像
img = qr.make_image(fill_color="black", back_color="white")

# 获取图像的像素大小
width, height = img.size

# 打印原始大小，用于调试
print(f"Original size: {width}x{height}")

# 保存图像
img.save("qrcode01.png")
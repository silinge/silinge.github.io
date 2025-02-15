import qrcode
qr = qrcode.QRCode(
    version=8,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data('https://silinge.github.io/article/whoami.html')
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("qr8.png")
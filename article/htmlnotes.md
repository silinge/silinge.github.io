 让我来解释一下 viewport 在 HTML 中的常用设置。

viewport 最基本和最常用的设置是：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

这行代码的主要参数解释：
1. `width=device-width`: 将viewport宽度设置为设备的宽度
2. `initial-scale=1.0`: 设置页面的初始缩放比例为1

其他常用的viewport参数包括：

```html
<!-- 完整的viewport设置示例 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
```

各参数说明：
- `maximum-scale`: 允许用户缩放的最大比例
- `minimum-scale`: 允许用户缩放的最小比例
- `user-scalable`: 是否允许用户缩放页面(yes/no)

一些特殊场景的设置：

```html
<!-- 禁止用户缩放 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">

<!-- 设置具体宽度 -->
<meta name="viewport" content="width=640">

<!-- 允许用户缩放并设置范围 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, minimum-scale=0.5">
```

使用建议：
1. 对于响应式网站，推荐使用最基本的设置即可
2. 某些特殊场景（如游戏）可能需要禁用缩放
3. 建议不要随意禁用用户缩放，这可能影响网站的可访问性

需要注意的是，这些设置主要用于移动端网页优化，在桌面端浏览器中这些设置基本不会产生效果。
D:\silinge.github.io\article\htmlnotes.md

.cat-right-ear {
  height: 0;
  width: 0;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-top: 35px solid transparent;
  border-bottom: 35px solid red;
}

* {
  box-sizing: border-box;
}

body {
  background-color: #c9d2fc;
}

.cat-head {
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background: linear-gradient(#5e5e5e 85%, #45454f 100%);
  width: 205px;
  height: 180px;
  border: 1px solid #000;
  border-radius: 46%;
}

.cat-left-ear {
  position: absolute;
  top: -26px;
  left: -31px;
  z-index: 1;
  border-top-left-radius: 90px;
  border-top-right-radius: 10px;
  transform: rotate(-45deg);
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 70px solid #5e5e5e;
}

.cat-right-ear {
  position: absolute;
  top: -26px;
  left: 163px;
  z-index: 1;
  transform: rotate(45deg);
  border-top-left-radius: 90px;
  border-top-right-radius: 10px;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 70px solid #5e5e5e;
}

.cat-left-inner-ear {
  position: absolute;
  top: 22px;
  left: -20px;
  border-top-left-radius: 90px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 40%;
  border-bottom-left-radius: 40%;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #3b3b4f;
}

.cat-right-inner-ear {
  position: absolute;
  top: 22px;
  left: -20px;
  border-top-left-radius: 90px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 40%;
  border-bottom-left-radius: 40%;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 40px solid #3b3b4f;
}

.cat-left-eye {
  position: absolute;
  top: 54px;
  left: 39px;
  border-radius: 60%;
  transform: rotate(25deg);
  width: 30px;
  height: 40px;
  background-color: #000;
}

.cat-right-eye {
  position: absolute;
  top: 54px;
  left: 134px;
  border-radius: 60%;
  transform: rotate(-25deg);
  width: 30px;
  height: 40px;
  background-color: #000;
}

.cat-left-inner-eye {
  position: absolute;
  top: 8px;
  left: 2px;
  width: 10px;
  height: 20px;
  transform: rotate(10deg);
  background-color: #fff;
  border-radius: 60%;
}

.cat-right-inner-eye {
  position: absolute;
  top: 8px;
  left: 18px;
  transform: rotate(-5deg);
  width: 10px;
  height: 20px;
  background-color: #fff;
  border-radius: 60%;
}

.cat-nose {
  position: absolute;
  top: 108px;
  left: 85px;
  border-top-left-radius: 50%;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
  transform: rotate(180deg);
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 20px solid #442c2c;
}

.cat-mouth div {
  width: 30px;
  height: 50px;
  border: 2px solid #000;
  border-radius: 190%/190px 150px 0 0;
  border-color: black transparent transparent transparent;
}

.cat-mouth-line-left {
  position: absolute;
  top: 88px;
  left: 74px;
  transform: rotate(170deg);
}

.cat-mouth-line-right {
  position: absolute;
  top: 88px;
  left: 91px;
  transform: rotate(165deg);
}

.cat-whiskers-left div {
  width: 40px;
  height: 1px;
  background-color: #000;
}

.cat-whiskers-right div {
  width: 40px;
  height: 1px;
  background-color: #000;
}

.cat-whisker-left-top {
  position: absolute;
  top: 120px;
  left: 52px;
  transform: rotate(10deg);
}

.cat-whisker-left-middle {
  position: absolute;
  top: 127px;
  left: 52px;
  transform: rotate(3deg);
}

.cat-whisker-left-bottom {
  position: absolute;
  top: 134px;
  left: 52px;
  transform: rotate(-3deg);
}

.cat-whisker-right-top {
  position: absolute;
  top: 120px;
  left: 109px;
  transform: rotate(-10deg);
}

.cat-whisker-right-middle {
  position: absolute;
  top: 127px;
  left: 109px;
  transform: rotate(-3deg);
}

.cat-whisker-right-bottom {
  position: absolute;
  top: 134px;
  left: 109px;

  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>fCC Cat Painting</title>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <main>
      <div class="cat-head">
        <div class="cat-ears">
          <div class="cat-left-ear">
            <div class="cat-left-inner-ear"></div>
          </div>
          <div class="cat-right-ear">
            <div class="cat-right-inner-ear"></div>
          </div>
        </div>

        <div class="cat-eyes">
          <div class="cat-left-eye">
            <div class="cat-left-inner-eye"></div>
          </div>
          <div class="cat-right-eye">
            <div class="cat-right-inner-eye"></div>
          </div>
        </div>

        <div class="cat-nose"></div>

        <div class="cat-mouth">
          <div class="cat-mouth-line-left"></div>
          <div class="cat-mouth-line-right"></div>
        </div>

        <div class="cat-whiskers">
          <div class="cat-whiskers-left">
            <div class="cat-whisker-left-top"></div>
            <div class="cat-whisker-left-middle"></div>
            <div class="cat-whisker-left-bottom"></div>
          </div>
          <div class="cat-whiskers-right">
            <div class="cat-whisker-right-top"></div>
            <div class="cat-whisker-right-middle"></div>
            <div class="cat-whisker-right-bottom"></div>
          </div>
        </div>

      </div>
    </main>
</body>
</html>

<div class="keys">
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
      </div>
      <div class="keys">
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
        <div class="key black--key"></div>
      </div>

.bb1d {
  width: 100%;
  height: 70%;
  background: linear-gradient(
      orange,
      var(--building-color1) 80%,
      var(--window-color1)
    );      

    在天空渐变颜色列表的顶部，你可以在其中放置渐变方向；添加 circle closest-corner at 15% 15%,。 这会将渐变的起点移动到距离顶部和左侧 15% 的位置。 渐变将在 closest-corner 处结束，形状为 circle。 这些是渐变中内置的一些关键字，用于描述其行为方式。
    .sky {
  background: radial-gradient(
      circle closest-corner at 15% 15%,
      #ffcf33,
      #ffcf33 20%,
      #ffff66 21%,
      #bbeeff 100%
    );
}

main {
  display: grid;
  grid-template-columns: minmax(2rem, 1fr) minmax(min-content, 94rem) minmax(2rem, 1fr);
}

步骤 52
如果你想添加更多社交图标，但将它们保持在同一行，则需要更新 grid-template-columns 以创建其他列。 作为替代方案，你可以使用 grid-auto-flow 属性。

此属性将 row 或 column 作为第一个值，第二个值可选 dense。 grid-auto-flow 使用自动放置算法来调整网格布局。 将其设置为 column，将告诉算法根据需要为内容创建新列。 dense 值允许算法回溯并用较小的项目填充网格中的空白，这可能导致项目出现乱序。

对于你的 .social-icons 选择器，将 grid-auto-flow 属性设置为 column。

.line:nth-of-type(2){
  transform:rotate(60deg);
}
为你的第二个 .line 元素创建一个选择器。 设置 transform 属性为 rotate(60deg)。

请记住，transform属性允许你改变一个元素的形状。 在这种情况下，使用 rotate(60deg) 值会将元素围绕其 transform-origin 点顺时针旋转 60 度。

将 .cabin 规则的 animation 属性设置为 cabins 10s linear infinite。 这将按顺序设置 animation-name、animation-duration、animation-timing-function 和 animation-iteration-count 属性。

.wheel {
  border: 2px solid black;
  border-radius: 50%;
  margin-left: 50px;
  position: absolute;
  height: 55vw;
  width: 55vw;
  max-width: 500px;
  max-height: 500px;
  animation-name: wheel;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.line {
  background-color: black;
  width: 50%;
  height: 2px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0% 0%;
}

.line:nth-of-type(2) {
  transform: rotate(60deg);
}
.line:nth-of-type(3) {
  transform: rotate(120deg);
}
.line:nth-of-type(4) {
  transform: rotate(180deg);
}
.line:nth-of-type(5) {
  transform: rotate(240deg);
}
.line:nth-of-type(6) {
  transform: rotate(300deg);
}

.cabin {
  background-color: red;
  width: 20%;
  height: 20%;
  position: absolute;
  border: 2px solid;
  transform-origin: 50% 0%;
  animation: cabins 10s ease-in-out infinite;
}

.cabin:nth-of-type(1) {
  right: -8.5%;
  top: 50%;
}
.cabin:nth-of-type(2) {
  right: 17%;
  top: 93.5%;
}
.cabin:nth-of-type(3) {
  right: 67%;
  top: 93.5%;
}
.cabin:nth-of-type(4) {
  left: -8.5%;
  top: 50%;
}
.cabin:nth-of-type(5) {
  left: 17%;
  top: 7%;
}
.cabin:nth-of-type(6) {
  right: 17%;
  top: 7%;
}

@keyframes wheel {
   0% {
     transform: rotate(0deg);
   }
   100% {
     transform: rotate(360deg);
   }
}

@keyframes cabins {
  0% {
    transform: rotate(0deg);
  }
  25% {
    background-color: yellow;
  }
  50% {
    background-color: purple;
  }
  100% {
    transform: rotate(-360deg);
  }
}

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Ferris Wheel</title>
    <link rel="stylesheet" href="./styles.css">
  </head>
  <body>
    <div class="wheel">
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>
      <span class="line"></span>

      <div class="cabin"></div>
      <div class="cabin"></div>
      <div class="cabin"></div>
      <div class="cabin"></div>
      <div class="cabin"></div>
      <div class="cabin"></div>
    </div>
  </body>
</html>

删除横向和纵向滚动栏，只使用一个属性。   overflow:hidden;   margin:--fcc-expected-- ？?？ margin:auto;

要使冰山看起来更像一座山，可以使用 skew transform 函数，这需要两个参数。 第一个是沿横坐标倾斜的角度，第二个是沿纵坐标倾斜的角度。

使用 transform 属性来使冰山沿 x 轴倾斜 0deg 沿 y 轴倾斜 44deg。   transform:skew(0deg, 44deg);

选择 .penguin 所有的后代元素，将其 position 设置为 absolute。 
.penguin *{
    position:absolute;
  }

  创建一个伪元素作为 .penguin-body 元素的第一个子元素，这是企鹅身体的装饰 。 设置伪元素的 content 属性为空字符串。 .penguin-body::before{
  content:"";
}

将伪元素的透明度提高 30%。 opacity:70%;

线性渐变，首先将其旋转 130deg，然后反转 x 轴。 transform:rotate(130deg) scaleX(-1);

选择 .penguin 元素的活动（active）状态，在水平垂直两个维度增加尺寸 50%。  transform:scale(1.5);

更改 .penguin 元素的 transition 行为， 设置动画周期的时长为 1s，关键帧的缓动函数为 ease-in-out，动画延迟为 0ms。 transition:1s ease-in-out 0ms;

计算 .ground 元素的 height，使其为视窗高度减 .penguin 元素的高度。height: calc(100vh - 300px);


aria2c \
  --check-certificate=false \
  --min-tls-version=TLSv1.2 \
  --max-tls-version=TLSv1.3 \
  --disable-ipv6=true \
  --connect-timeout=30 \
  --retry-wait=5 \
  --max-tries=3 \https://xvwilliam.us.kg/downloads/minipc.webm
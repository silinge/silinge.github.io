/**
 * GIF encoder version 1.0
 * 
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @author Johan Nordberg (JS version - code@johan-nordberg.com)
 */

// GIFEncoder 类定义
var GIFEncoder = function(width, height, options) {
    options = options || {};
    
    // 初始化变量
    this.width = width;
    this.height = height;
    this.transparent = options.transparent || null;
    this.transIndex = 0;
    this.repeat = options.repeat || 0;
    this.delay = 0;
    this.image = null;
    this.pixels = null;
    this.indexedPixels = null;
    this.colorDepth = null;
    this.colorTab = null;
    this.usedEntry = new Array();
    this.palSize = 7;
    this.dispose = -1;
    this.firstFrame = true;
    this.sizeSet = false;
    this.sample = 10;
    
    // 输出缓冲区
    this.out = new Array();
    
    // 添加帧
    this.addFrame = function(frame, options) {
        options = options || {};
        
        if (!this.sizeSet) {
            this.setSize(frame.width, frame.height);
        }
        
        this.image = frame;
        this.pixels = frame.getContext('2d').getImageData(0, 0, frame.width, frame.height).data;
        this.indexedPixels = new Array(this.pixels.length / 4);
        
        // 颜色量化
        var nq = new NeuQuant(this.pixels, this.sample);
        nq.buildColormap();
        this.colorTab = nq.getColormap();
        
        // 映射像素到新调色板
        var k = 0;
        for (var j = 0; j < this.pixels.length; j += 4) {
            var index = nq.lookupRGB(this.pixels[j], this.pixels[j + 1], this.pixels[j + 2]);
            this.usedEntry[index] = true;
            this.indexedPixels[k++] = index;
        }
        
        this.pixels = null;
        this.colorDepth = 8;
        this.palSize = 7;
        
        // 设置帧延迟
        this.delay = options.delay || 0;
        
        // 设置帧处理方式
        this.dispose = options.dispose || 2;
        
        // 设置透明度
        if (options.transparent !== undefined && options.transparent !== null) {
            this.transparent = options.transparent;
            if (typeof this.transparent === 'object' && this.transparent.r !== undefined) {
                this.transIndex = nq.lookupRGB(this.transparent.r, this.transparent.g, this.transparent.b);
            } else {
                this.transIndex = 0;
            }
        } else {
            this.transparent = null;
            this.transIndex = 0;
        }
    };
    
    // 设置尺寸
    this.setSize = function(width, height) {
        if (width > 0 && height > 0) {
            this.sizeSet = true;
            this.width = width;
            this.height = height;
        }
    };
    
    // 获取GIF数据
    this.getData = function() {
        this.writeHeader();
        if (this.firstFrame) {
            this.writeImage();
        } else {
            this.writeExt();
            this.writeImage();
        }
        this.writeTrailer();
        return this.out;
    };
    
    // 写入GIF头部
    this.writeHeader = function() {
        this.writeString("GIF89a");
        this.writeShort(this.width);
        this.writeShort(this.height);
        this.writeByte(0x80 | this.palSize);
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(0);
        this.writeColorTab();
        if (this.repeat >= 0) {
            this.writeShort(0xFFFB);
            this.writeShort(this.repeat);
            this.writeByte(0);
        }
    };
    
    // 写入颜色表
    this.writeColorTab = function() {
        this.writeBytes(this.colorTab, 0, this.colorTab.length);
        var n = (3 * 256) - this.colorTab.length;
        for (var i = 0; i < n; i++) {
            this.writeByte(0);
        }
    };
    
    // 写入图像数据
    this.writeImage = function() {
        this.writeByte(0x2C);
        this.writeShort(0);
        this.writeShort(0);
        this.writeShort(this.width);
        this.writeShort(this.height);
        this.writeByte(0);
        this.writeByte(this.colorDepth);
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(0);
        this.writeByte(1);
        this.writeByte(0);
        this.writeByte(0);
        this.writeBytes(this.indexedPixels, 0, this.indexedPixels.length);
    };
    
    // 写入扩展块
    this.writeExt = function() {
        this.writeByte(0x21);
        this.writeByte(0xf9);
        this.writeByte(4);
        this.writeByte((this.dispose << 2) | 0);
        this.writeShort(this.delay);
        this.writeByte(this.transIndex);
        this.writeByte(0);
    };
    
    // 写入GIF尾部
    this.writeTrailer = function() {
        this.writeByte(0x3b);
    };
    
    // 写入字节
    this.writeByte = function(bValue) {
        this.out.push(bValue);
    };
    
    // 写入短整型
    this.writeShort = function(iValue) {
        this.writeByte(iValue & 0xFF);
        this.writeByte((iValue >> 8) & 0xFF);
    };
    
    // 写入字符串
    this.writeString = function(s) {
        for (var i = 0; i < s.length; i++) {
            this.writeByte(s.charCodeAt(i));
        }
    };
    
    // 写入字节数组
    this.writeBytes = function(b, off, len) {
        for (var i = 0; i < len; i++) {
            this.writeByte(b[off + i]);
        }
    };
};

// NeuQuant 颜色量化算法
var NeuQuant = function(pixels, samplefac) {
    var networkSize = 256;
    var network = new Array(networkSize);
    var bias = new Array(networkSize);
    var freq = new Array(networkSize);
    var radpower = new Array(30);
    
    // 常量
    var netbiasshift = 4;
    var intbias = 1 << netbiasshift;
    var radiusbias = 1 << (netbiasshift + 8);
    var radius = radiusbias >> 6;
    var alpharadbias = 1 << (netbiasshift + 9);
    
    // 初始化网络
    for (var i = 0; i < networkSize; i++) {
        network[i] = new Array(3);
        network[i][0] = (i << (netbiasshift + 8)) / networkSize;
        network[i][1] = (i << (netbiasshift + 8)) / networkSize;
        network[i][2] = (i << (netbiasshift + 8)) / networkSize;
        freq[i] = intbias / networkSize;
        bias[i] = 0;
    }
    
    // 构建颜色映射
    function buildColormap() {
        var radius = radiusbias - radius;
        var rad = radius * radius;
        var step = 1 / samplefac;
        var pos = 0;
        var i = 0;
        
        while (i < pixels.length) {
            var r = pixels[i++];
            var g = pixels[i++];
            var b = pixels[i++];
            var a = pixels[i++];
            
            if (a < 128) continue;
            
            var j = searchbias(r, g, b);
            var dist = (r - network[j][0]) * (r - network[j][0]) +
                      (g - network[j][1]) * (g - network[j][1]) +
                      (b - network[j][2]) * (b - network[j][2]);
            
            if (dist < rad) {
                var alpha = (1 - dist / rad) * alpharadbias;
                network[j][0] += alpha * (r - network[j][0]);
                network[j][1] += alpha * (g - network[j][1]);
                network[j][2] += alpha * (b - network[j][2]);
                bias[j] += alpha;
                freq[j] += alpha;
            }
            
            pos += step;
            if (pos >= 1) {
                pos -= 1;
                i += 4;
            }
        }
    }
    
    // 搜索最佳匹配颜色
    function searchbias(r, g, b) {
        var bestd = ~(1 << 31);
        var best = -1;
        var i = 0;
        
        while (i < networkSize) {
            var dist = (r - network[i][0]) * (r - network[i][0]) +
                      (g - network[i][1]) * (g - network[i][1]) +
                      (b - network[i][2]) * (b - network[i][2]);
            
            if (dist < bestd) {
                bestd = dist;
                best = i;
            }
            
            i++;
        }
        
        return best;
    }
    
    // 获取颜色映射
    function getColormap() {
        var map = new Array();
        var index = new Array();
        
        // 初始化索引数组
        for (var i = 0; i < networkSize; i++) {
            index[i] = i;
        }
        
        // 按亮度排序
        for (var i = 0; i < networkSize - 1; i++) {
            for (var j = i + 1; j < networkSize; j++) {
                var sum1 = network[index[i]][0] + network[index[i]][1] + network[index[i]][2];
                var sum2 = network[index[j]][0] + network[index[j]][1] + network[index[j]][2];
                if (sum1 > sum2) {
                    var temp = index[i];
                    index[i] = index[j];
                    index[j] = temp;
                }
            }
        }
        
        // 生成颜色映射
        for (var i = 0; i < networkSize; i++) {
            var j = index[i];
            map.push(network[j][0]);
            map.push(network[j][1]);
            map.push(network[j][2]);
        }
        
        return map;
    }
    
    // 构建颜色映射
    buildColormap();
    
    // 返回颜色映射
    return {
        buildColormap: buildColormap,
        getColormap: getColormap,
        lookupRGB: searchbias
    };
};

// GIF 主类
var GIF = function(options) {
    options = options || {};
    
    // Convert options to proper format
    var opt = {
        quality: options.quality || 10,
        width: options.width || null,
        height: options.height || null,
        repeat: options.repeat || 0,
        background: options.background || '#ffffff',
        transparent: options.transparent || null,
        dither: options.dither || false,
        debug: options.debug || false
    };

    // Initialize variables
    var frames = [];
    var currentFrame = 0;
    var running = false;

    // Add a frame to the animation
    this.addFrame = function(frame, options) {
        options = options || {};
        
        if (!opt.width || !opt.height) {
            opt.width = frame.width;
            opt.height = frame.height;
        }
        
        // 验证帧数据
        if (!frame || !frame.width || !frame.height) {
            throw new Error('Invalid frame data');
        }
        
        frames.push({
            frame: frame,
            delay: options.delay || 0,
            dispose: options.dispose || 2,
            transparent: options.transparent || null
        });
    };

    // Start rendering
    this.render = function() {
        if (frames.length === 0) {
            if (typeof opt.onError === 'function') {
                opt.onError('No frames to render');
            }
            return;
        }

        if (running) {
            return;
        }

        running = true;
        currentFrame = 0;

        try {
            // Create encoder
            var encoder = new GIFEncoder(opt.width, opt.height, opt);

            // Add frames
            for (var i = 0; i < frames.length; i++) {
                var frame = frames[i];
                
                // 验证帧数据
                if (!frame || !frame.frame) {
                    console.error(`Invalid frame at index ${i}`);
                    continue;
                }
                
                encoder.addFrame(frame.frame, {
                    delay: frame.delay,
                    dispose: frame.dispose,
                    transparent: frame.transparent
                });

                if (typeof opt.onProgress === 'function') {
                    opt.onProgress((i + 1) / frames.length);
                }
            }

            // Get GIF data
            var gifData = encoder.getData();
            
            // 验证GIF数据
            if (!gifData || gifData.length === 0) {
                throw new Error('Failed to generate GIF data');
            }

            // Create blob
            var blob = new Blob([gifData], { type: 'image/gif' });

            // Call finished callback
            if (typeof opt.onFinished === 'function') {
                opt.onFinished(blob);
            }

            running = false;
        } catch (error) {
            console.error('GIF generation error:', error);
            if (typeof opt.onError === 'function') {
                opt.onError(error);
            }
            running = false;
        }
    };

    // Abort rendering
    this.abort = function() {
        running = false;
    };

    // Set event handlers
    this.onProgress = function(callback) {
        opt.onProgress = callback;
    };

    this.onFinished = function(callback) {
        opt.onFinished = callback;
    };

    this.onError = function(callback) {
        opt.onError = callback;
    };
}; 
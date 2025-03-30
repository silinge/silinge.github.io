/**
 * GIF encoder version 1.0
 * 
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @author Johan Nordberg (JS version - code@johan-nordberg.com)
 */

var GIFEncoder = function(width, height, options) {
    options = options || {};
    
    // Convert options to proper format
    var opt = {
        quality: options.quality || 10,
        repeat: options.repeat || 0,
        background: options.background || '#ffffff',
        transparent: options.transparent || null,
        dither: options.dither || false
    };

    // Initialize variables
    var width = width;
    var height = height;
    var transparent = opt.transparent;
    var transIndex = 0;
    var repeat = opt.repeat;
    var delay = 0;
    var image = null;
    var pixels = null;
    var indexedPixels = null;
    var colorDepth = null;
    var colorTab = null;
    var usedEntry = new Array();
    var palSize = 7;
    var dispose = -1;
    var firstFrame = true;
    var sizeSet = false;
    var sample = 10;

    // Initialize color table
    function init() {
        colorTab = null;
        pixels = null;
        indexedPixels = null;
        colorDepth = null;
        usedEntry = new Array();
        palSize = 7;
        transparent = null;
        transIndex = 0;
        repeat = 0;
        delay = 0;
        dispose = -1;
        firstFrame = true;
        sizeSet = false;
        sample = 10;
    }

    // Set the GIF frame size
    function setSize(width, height) {
        if (width > 0 && height > 0) {
            sizeSet = true;
            this.width = width;
            this.height = height;
        }
    }

    // Add a frame to the GIF
    function addFrame(imageData, options) {
        options = options || {};
        
        if (!sizeSet) {
            setSize(imageData.width, imageData.height);
        }
        
        image = imageData;
        pixels = image.data;
        indexedPixels = new Array(pixels.length / 4);
        
        // Convert RGB to indexed color
        var nq = new NeuQuant(pixels, sample);
        nq.buildColormap();
        colorTab = nq.getColormap();
        
        // Map image pixels to new palette
        var k = 0;
        for (var j = 0; j < pixels.length; j += 4) {
            var index = nq.lookupRGB(pixels[j], pixels[j + 1], pixels[j + 2]);
            usedEntry[index] = true;
            indexedPixels[k++] = index;
        }
        
        pixels = null;
        colorDepth = 8;
        palSize = 7;
        
        // Set frame delay
        delay = options.delay || 0;
        
        // Set frame disposal
        dispose = options.dispose || 2;
        
        // Set frame transparency
        if (options.transparent !== undefined) {
            transparent = options.transparent;
            transIndex = nq.lookupRGB(transparent.r, transparent.g, transparent.b);
        }
    }

    // Write GIF file header
    function writeHeader() {
        writeString("GIF89a");
        writeShort(width);
        writeShort(height);
        writeByte(0x80 | palSize);
        writeByte(0);
        writeByte(0);
        writeByte(0);
        writeByte(0);
        writeByte(0);
        writeColorTab();
        if (repeat >= 0) {
            writeShort(0xFFFB);
            writeShort(repeat);
            writeByte(0);
        }
    }

    // Write color table
    function writeColorTab() {
        writeBytes(colorTab, 0, colorTab.length);
        var n = (3 * 256) - colorTab.length;
        for (var i = 0; i < n; i++) {
            writeByte(0);
        }
    }

    // Write image data
    function writeImage() {
        writeByte(0x2C);
        writeShort(0);
        writeShort(0);
        writeShort(width);
        writeShort(height);
        writeByte(0);
        writeByte(colorDepth);
        writeByte(0);
        writeByte(0);
        writeByte(0);
        writeByte(0);
        writeByte(1);
        writeByte(0);
        writeByte(0);
        writeBytes(indexedPixels, 0, indexedPixels.length);
    }

    // Write extension block
    function writeExt() {
        writeByte(0x21);
        writeByte(0xf9);
        writeByte(4);
        writeByte((dispose << 2) | 0);
        writeShort(delay);
        writeByte(transIndex);
        writeByte(0);
    }

    // Write GIF file trailer
    function writeTrailer() {
        writeByte(0x3b);
    }

    // Write a byte to the output
    function writeByte(bValue) {
        out.writeByte(bValue);
    }

    // Write a short to the output
    function writeShort(iValue) {
        out.writeByte(iValue & 0xFF);
        out.writeByte((iValue >> 8) & 0xFF);
    }

    // Write a string to the output
    function writeString(s) {
        for (var i = 0; i < s.length; i++) {
            out.writeByte(s.charCodeAt(i));
        }
    }

    // Write bytes to the output
    function writeBytes(b, off, len) {
        for (var i = 0; i < len; i++) {
            out.writeByte(b[off + i]);
        }
    }

    // Initialize output
    var out = new ByteArray();

    // Start encoding
    init();
    writeHeader();
    if (firstFrame) {
        writeImage();
    } else {
        writeExt();
        writeImage();
    }
    writeTrailer();

    // Return the encoded GIF
    return out.getData();
};

// NeuQuant Neural-Net Quantization Algorithm
var NeuQuant = function(pixels, samplefac) {
    var networkSize = 256;
    var network = new Array(networkSize);
    var bias = new Array(networkSize);
    var freq = new Array(networkSize);
    var radpower = new Array(30);
    
    // Initialize network
    for (var i = 0; i < networkSize; i++) {
        network[i] = new Array(3);
        network[i][0] = (i << (netbiasshift + 8)) / networkSize;
        network[i][1] = (i << (netbiasshift + 8)) / networkSize;
        network[i][2] = (i << (netbiasshift + 8)) / networkSize;
        freq[i] = intbias / networkSize;
        bias[i] = 0;
    }
    
    // Build colormap
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
    
    // Search for best matching color
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
    
    // Get colormap
    function getColormap() {
        var map = new Array();
        var index = new Array();
        
        for (var i = 0; i < networkSize; i++) {
            index[network[i][0]] = i;
        }
        
        var k = 0;
        for (var i = 0; i < networkSize; i++) {
            var j = index[i];
            map[k++] = network[j][0];
            map[k++] = network[j][1];
            map[k++] = network[j][2];
        }
        
        return map;
    }
    
    // Constants
    var netbiasshift = 4;
    var intbias = 1 << netbiasshift;
    var radiusbias = 1 << (netbiasshift + 8);
    var radius = radiusbias >> 6;
    var alpharadbias = 1 << (netbiasshift + 9);
    
    // Build colormap
    buildColormap();
    
    // Return colormap
    return {
        buildColormap: buildColormap,
        getColormap: getColormap,
        lookupRGB: searchbias
    };
};

// ByteArray implementation
var ByteArray = function() {
    var data = new Array();
    
    this.writeByte = function(b) {
        data.push(b);
    };
    
    this.getData = function() {
        return data;
    };
};

// Handle worker messages
self.onmessage = function(e) {
    var data = e.data;
    
    switch (data.type) {
        case 'start':
            var encoder = new GIFEncoder(data.options.width, data.options.height, data.options);
            encoder.addFrame(data.frame, data.frameOptions);
            var gif = encoder.getData();
            self.postMessage({ type: 'frame', frame: gif });
            break;
            
        case 'error':
            self.postMessage({ type: 'error', error: data.error });
            break;
    }
}; 
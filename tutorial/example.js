
// var count = 1;
// while (count < 11){
//     console.log(count);
//     count++;
// }
// var count = 1;
// do {
//     console.log(count)
//     count++;
// } while(count < 11)

/* var count = 1;

do {
    console.log(count);
    count++;
} while(count < 1); */

/* for (initial condition; test condition; alter condition){
    statements;
} */

/* for(var count = 1; count < 11; count++){
    console.log(count);
} */

/* var beatles = Array("John", "Paul", "George", "Ringo");
for(var count = 0; count < beatles.length; count++){
    console.log(beatles[count]);
} */

/* function convertToCelsius(temp){
    var result = temp - 32;
    result = result / 1.8;
    return result;
}
console.log(convertToCelsius(60)); */

/*  var current_date = new Date();
var today = current_date.getDay();

console.log(today);
console.log(current_date.getDate());
console.log(current_date.getMonth());
这里的星期几和月份显示是有问题的，星期日是0，星期一是1，而月份从0开始，要得到正确的月份需要+1 */

/* var typeOne = document.getElementById("purchases");
console.log(typeof typeOne);
alert(document.getElementsByTagName("li").length); */

/* for (var i = 0; i < document.getElementsByTagName("li").length; i++){
    alert(typeof document.getElementsByTagName("li")[i]);
} */

/* var shopping = document.getElementById("purchases");
var items = shopping.getElementsByTagName("*");
for (var i=0; i<items.length; i++){
    alert(typeof items[i]);
} */

// function getElementsByClassName(node, classname){
//     if (node.getElementsByClassName){
//         return node.getElementsByClassName(classname);
//     } else {
//         var results = new Array();
//         var elems = node.getElementsByTagName("*");
//         for (var i=0; i<elems.length; i++){
//             if (elems[i].className.indexOf(classname) != -1){
//                 results[results.length] = elems[i];
//             }
//         }
//         return results;
//     }
// }

// 兼容老浏览器没有getElementsByClassName功能的问题。
// indexOf方法可返回某个指定的字符串值在字符中首次出现的位置。如果没有找到匹配的字符串则返回-1
// lastIndexOf() 返回一个指定的字符串值最后出现的位置，如果指定第二个参数start则在一个字符串中指定位置从后向前搜索
// getAttribute setAttribute;

/* var paras = document.getElementsByTagName("p");
for (var i = 0; i < paras.length; i++){
    alert(paras[i].getAttribute("title"));
} */

/* var paras = document.getElementsByTagName("p");
for (var i=0; i < paras.length; i++){
    var title_text = paras[i].getAttribute("title");
    if (title_text != null){
        alert(title_text);
    }
}
 */
// 确保了有title的p才会alert 不会空报

/* var shopping = document.getElementById("purchases");
alert(shopping.getAttribute("title"));
shopping.setAttribute("title", "a list of goods");
alert(shopping.getAttribute("title")); */

/* var paras = document.getElementsByTagName("p");
for (var i=0; i<paras.length; i++){
    var title_text = paras[i].getAttribute("title");
    if (title_text){
        paras[i].setAttribute("title", "brand new title text " + i);
        alert(paras[i].getAttribute("title"));
    }
} */

// var items = document.getElementsByTagName("li");
// for (var i=0; i < items.length; i++){
//     alert(items[i]);
// }

// alert(document.getElementsByTagName("*").length);
/* var shopping = document.getElementById("purchases");
var items = shopping.getElementsByTagName("*"); */

/* function showPic(whichpic){
    var source = whichpic.getAttribute("href");
    var holder = document.getElementById("placeholder");
    holder.setAttribute("src", source);
    //等价于 holder.src = source;
    var titleText = whichpic.getAttribute("title");
    var textHolder = document.getElementById("description");
    textHolder.childNodes[0].nodeValue = titleText;
    // textHolder.firstChild.nodeValue = titleText;
}
 */
// onclick = "showPic(this); return false"; 用于html链接中 触发点击动作

/* function countBodyChildren(){
    var body_element = document.getElementsByTagName("body")[0];
    // alert(body_element.childNodes.length);
    alert(body_element.nodeType);
} */
// window.onload = countBodyChildren;

/* function popUp(winURL){
    window.open(winURL, "popup","width=320, height=480");
}
 */
/* var links = document.getElementsByTagName("a");
for (var i=0; i<links.length; i++) {
    if(links[i].getAttribute("class")=="popup"){
        links[i].onclick = function(){
            popUp(this.getAttribute("href"));
            return false;
        }
    }
} */

/* window.onload = prepareLinks;
function prepareLinks(){
    var links = document.getElementsByTagName("a");
    for (var i=0; i<links.length; i++){
        if(links[i].getAttribute("class")=="popup"){
            links[i].onclick = function(){
                popUp(this.getAttribute("href"));
                return false;
            }
        }
    }
} */

// 测试功能是否可用
/* if(!method){
    return false;
}

if(!document.getElementById){
    return false;
}

if(!document.getElementById) return false;

if(!document.getElementById || !document.getElementsByTagName) return false; */

/* function popUp(winURL){
    window.open(winURL, "popup", "width=320, height=480");
};

window.onload = function(){
    if(!document.getElementsByTagName) return false;
    var links = document.getElementsByTagName("a");
    for (var i=0; i < links.length; i++){
        if(links[i].getAttribute("class")=="popup"){
            links[i].onclick = function(){
                popUp(this.getAttribute("href"));
                return false;
            }
        }
    }
}; */

/* function showPic(a){var b = a.getAttribute("href");document.getElementById("placeholder").setAttribute("src", b); a.getAttribute("title"); document.getElementById("description")};
 */
// showPic也需要检查元素是否存在
/* function showPic(whichpic){
    if(!document.getElementById("placeholder")) return false;
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    placeholder.setAttribute("src", source);

    if(document.getElementById("description")){
        // var text = whichpic.getAttribute("title");
        // var text = whichpic.getAttribute("title")? whichpic.getAttribute("title"): "";
        if (whichpic.getAttribute("title")){
            var text = whichpic.getAttribute("title");
        }else{
            var text = "";
        }
        var description = document.getElementById("description");
        if (description.firstChild.nodeType === 3){
        description.firstChild.nodeValue = text;
    }
    }
    return true;
} */
/* function prepareGallery(){
    /* if(!document.getElementById) return false;
    if(!document.getElementsByTagName) return false;

    if(!document.getElementById || !document.getElementsByTagName) return false;
 
    var supported = document.getElementById && document.getElementsByTagName;
    if(!supported) return false;

    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName('a');
    for (var i=1; i<links.length; i++){
        links[i].onclick = function(){ 
             showPic(this);
            return false; 

            // 这里修正 由函数showPic决定是否返回false值以取消onclick事件的默认行为 而不是默认showPic一定能够成功运行。如果图片切换成功 返回true; 不成则false 对函数取反;
            return !showPic(this);
        }
    }
} */

// 等待网页加载完之后才执行函数，执行一个不够，执行两个
/* window.onload = function(){
    showPic;
    prepareGallery;
} */

/* function showPic(whichpic){
    if(!document.getElementById("placeholder")) return false;
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    if(placeholder.nodeName != "IMG") return false;
    placeholder.setAttribute("src", source);

    if(document.getElementById("description")){
        var text = whichpic.getAttribute("title")? whichpic.getAttribute("title"):"";
        var description = document.getElementById("description");

        if(description.firstChild.nodeType == 3){
            description.firstChild.nodeValue = text;
        }
    }
    return true;
}


function prepareGallery(){
    if(!document.getElementById) return false;
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById("imagegallery")) return false;

    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i=0; i<links.length; i++){
        links[i].onclick = function(){
            // return !showPic(this);
            return showPic(this)?false:true;
        }
        // 如果只用键盘不用鼠标点击用enter和tab来打开链接 要把onkeypress事件加进来
        /* links.onkeypress = function(){
            return showPic(this)?false:true;
        }
    } 
        // 简化一下
        // links[i].onkeypress = links[i].onclick;
        // 但是吧onkeypress动作又多了，别用。只用onclick对enter依然有效，所有原样改回去
}
}
// 弹性方案，页面加载完成后执行任意多个函数



// addLoadEvent(funcOne);
// addLoadEvent(funcTwo);

addLoadEvent(prepareGallery); 


 
 /*function preparePlaceholder(){

    var placeholder = document.createElement("img");
    placeholder.setAttribute("src", "imagesc/placeholder.gif");
    placeholder.setAttribute("alt", "my image gallery");
    var description = document.createElement("p");
    description.setAttribute("id", "description");
    var desctext = document.createTextNode("Choose an image");
    description.appendChild(desctext);

    document.getElementsByTagName("body")[0].appendChild(placeholder);
    document.getElementsByTagName("body")[0].appendChild(description);
    parentElement.insertBefore(newElement, targetElement)
    targetElement-parentNode = parentElement 
    var gallery = document.getElementById("imagegallery");
    // gallery.parentNode.insertBefore(placeholder, gallery);
    // gallery.parentNode.insertBefore(description, gallery);
    insertAfter(placeholder, gallery);
    insertAfter(description, placeholder);
} */
/* function addLoadEvent(func){
        var oldonload = window.onload;
        if (typeof window.onload != 'function'){
            window.onload = func;
        }else{
            window.onload = function(){
                oldonload();
                func();
            }
        }
    }

function prepareGallery() {
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    if(!document.getElementById("imagegallery")) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i=0; i < links.length; i++){
        links[i].onclick = function(){
            return showPic(this)?false:true;
        }
    }
}

function showPic(whichpic){
    if(!document.getElementById("placeholder")) return false;
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    if(placeholder.nodeName != "IMG") return false;
    placeholder.setAttribute("src", source);
    if(document.getElementById("description")){
        var text = whichpic.getAttribute("title")?whichpic.getAttribute("title"):"";
        var description = document.getElementById("description");
        if(description.firstChild.nodeType == 3){
            description.firstChild.nodeValue = text;
        }
    }
    return true;
}

function insertAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

function preparePlaceholder(){
    if(!document.createElement) return false;
    if(!document.createTextNode) return false;
    if(!document.getElementById) return false;
    if(!document.getElementById("imagegallery")) return false;
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id", "placeholder");
    placeholder.setAttribute("src", "imagesc/placeholder.gif");
    placeholder.setAttribute("alt", "my image gallery");
    var description = document.createElement("p");
    description.setAttribute("id", "description");
    var desctext = document.createTextNode("Choose an image");
    description.appendChild(desctext);
    var gallery = document.getElementById("imagegallery");
    insertAfter(placeholder, gallery);
    insertAfter(description, placeholder);
}

addLoadEvent(prepareGallery)
addLoadEvent(preparePlaceholder) */
/* HTML-DOM 
document.getElementsByTagName("form")
document.forms

element.getAttribute("src")
element.src 

var source = whichpic.getAttribute("href")
var source = whichpic.href

placeholder.setAttribute("src", source)
placeholder.src = source */

// code7.1
/* function insertParagraph(text){
    var str = "<p>";
    str += text;
    str += "</p>";
    document.write(str);
} */

// code7.3
/* window.onload = function(){
    /* var testdiv = document.getElementById("testdiv");
    testdiv.innerHTML = "<p>This is <em>my em101</em> content.</p>";
    alert(testdiv.innerHTML); 
    var para = document.createElement("p");
    var info = "nodeName: "
    info += para.nodeName;
    info += " nodeType: ";
    info += para.nodeType;
    // alert(info);
    
    var testdiv = document.getElementById("testdiv");
    testdiv.appendChild(para);
    var testtext = document.createTextNode(info);
    para.appendChild(testtext);
} */

/* window.onload = function(){
    var para = document.createElement("p");
    var testtext = document.createTextNode("Create text method 2nd.");
    para.appendChild(testtext);
    var testdiv = document.getElementById("testdiv");
    testdiv.appendChild(para);

    var paraB = document.createElement("p");
    var txtA = document.createTextNode("This is ");
    paraB.appendChild(txtA);
    var emA = document.createElement("em");
    var txtB = document.createTextNode("my emA");
    emA.appendChild(txtB);
    paraB.appendChild(emA);
    var txtC = document.createTextNode(" content.");
    paraB.appendChild(txtC);
    var testdi6 = document.getElementById("testdiv");
    testdi6.appendChild(paraB);

    var paraC = document.createElement("P");
    var text1 = document.createTextNode("This is 3rd ");
    var emB = document.createElement("em");
    var text2 = document.createTextNode("my emb");
    var text3 = document.createTextNode(" content.");
    var testdi7 = document.getElementById("testdiv");
    paraC.appendChild(text1);
    emB.appendChild(text2);
    paraC.appendChild(emB);
    paraC.appendChild(text3);
    testdi7.appendChild(paraC);
} */

function addLoadEvent(func) {
    var oldonload = window.onload;
    if(typeof window.onload != 'function'){
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        }
    }
}

function prepareGallery() {
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    if(!document.getElementById("imagegallery")) return false;
    var gallery = document.getElementById("imagegallery");
    var links = gallery.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        links[i].onclick = function(){
            return showPic(this);
        }
        // links[i].onkeypress  = links[i].onclick;
    }
}

function showPic(whichpic){
    if(!document.getElementById("placeholder")) return true;
    var source = whichpic.getAttribute("href");
    var placeholder = document.getElementById("placeholder");
    placeholder.setAttribute("src", source);
    if(!document.getElementById("description")) return false;
    if(whichpic.getAttribute("title")) {
        var text = whichpic.getAttribute("title");
    } else {
        var text = "";
    }

    var description = document.getElementById("description");
    if(description.firstChild.nodeType == 3){
        description.firstChild.nodeValue = text;
    }
    return false;
}
function insertAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}



function preparePlaceholder() {
    if(!document.createElement) return false;
    if(!document.createTextNode) return false;
    if(!document.getElementById) return false;
    if(!document.getElementById("imagegallery")) return false;
    var placeholder = document.createElement("img");
    placeholder.setAttribute("id", "placeholder");
    placeholder.setAttribute("src", "imagesc/placeholder.gif");
    placeholder.setAttribute("alt", "my image gallery");
    var description = document.createElement("p");
    description.setAttribute("id", "description");
    var desctext = document.createTextNode("Choose an image");
    //这里出现过致命错误 document.createTextNode 写成了description.createTextNode 
    description.appendChild(desctext);
    var gallery = document.getElementById("imagegallery");
    insertAfter(placeholder, gallery);
    insertAfter(description, placeholder);
} 




addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);
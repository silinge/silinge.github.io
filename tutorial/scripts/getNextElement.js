/* var headers = document.getElementsByTagName("h1");
for(var i=0; i < headers.length; i++){
    var elem = getNextElement(headers[i].nextSibling);
    elem.style.fontWeight = "bold";
    elem.style.fontSize = "1.2em";
}

function getNextElement(node){
    if(node.nodeType == 1){
        return node;
    }
    if(node.nextSibling){
        return getNextElement(node.nextSibling);
    }
    return null;
} */


/* function styleHeaderSiblings() {
    if(!document.getElementsByTagName) return false;
    var header = document.getElementsByTagName("h1");
    var elem;
    for (var i = 0; i < header.length; i++) {
        elem = getNextElement(header[i].nextSibling);
        elem.style.fontWeight = "bold";
        elem.style.fontSize = "1.2em";
        
    }
} */

function styleHeaderSiblings() {
    if(!document.getElementsByTagName) return false;
    var headers = document.getElementsByTagName("h1");
    var elem;
    for(var i=0; i < headers.length; i++) {
        elem = getNextElement(headers[i].nextSibling);
        addClass(elem, "intro");
    }
}


function getNextElement(node){
    if(node.nodeType == 1){
        return node;
    }
    if(node.nextSibling){
        return getNextElement(node.nextSibling);
    }
    return null;
}

addLoadEvent(styleHeaderSiblings);

/* .intro{
    font-weight:bold;
    font-size:1.2em;
}

elem.setAttribute("class", "intro");
给元素添加class class="intro*  intro的样式添加到css
elem.className = "intro" 也可。
这是替换了classname
elem.className += "intro" 则是追加一个class intro 原有的class不会消失*/

function addClass(element, value){
    if(!element.className){
        element.className = value;
    }else{
        newClassName = element.className;
        newClassName += " ";
        newClassName += value;
        element.className = newClassName;
    }
}

function styleElementSibling(tag, theclass) {
    if(!document.getElementsByTagName) return false;
    var elems = document.getElementsByTagName(tag);
    var elem;
    for(var i=0; i < elems.length; i++){
        elem = getNextElement(elems[i].nextSibling);
        addClass(elem, theclass)
    }
}

addLoadEvent(function(){
    styleElementSibling("h1", "intro")
})
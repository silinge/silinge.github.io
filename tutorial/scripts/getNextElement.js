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


function styleHeaderSiblings() {
    if(!document.getElementsByTagName) return false;
    var header = document.getElementsByTagName("h1");
    var elem;
    for (var i = 0; i < header.length; i++) {
        elem = getNextElement(header[i].nextSibling);
        elem.style.fontWeight = "bold";
        elem.style.fontSize = "1.2em";
        
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
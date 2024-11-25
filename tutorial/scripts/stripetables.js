/* function stripeTables(){
    if(!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    var odd, rows;
    for (var i=0; i < tables.length; i++){
        odd = false;
        rows = tables[i].getElementsByTagName("tr");
        for (var j=0; j < rows.length; j++){
            if(odd == true) {
                rows[j].style.backgroundColor = "#ddc";
                odd = false;
            } else {
                odd = true;
            }
        }
    }
} */
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
    

function stripeTables(){
    if(!document.getElementsByTagName) return false;
    var tables = document.getElementsByTagName("table");
    var odd, rows;
    for(var i=0; i < tables.length; i++){
        odd = false;
        rows = tables[i].getElementsByTagName("tr");
        for(var j=0; j < rows.length; j++){
            if(odd == true){
                addClass(rows[j], "odd");
                odd = false;
            } else {
                odd = true;
            }
        }
    }
}

addLoadEvent(stripeTables);

function hightlightRows(){
    if(!document.getElementsByTagName) return false;
    var rows = document.getElementsByTagName("tr");
    for (var i=0; i < rows.length; i++){
        rows[i].onmouseover = function(){
            this.style.fontWeight = "bold";
        }
        rows[i].onmouseout = function(){
            this.style.fontWeight = "normal";
        }
    }
}

addLoadEvent(hightlightRows);


/* function positionMessage() {
    if(!document.getElementById) return false;
    if(!document.getElementById("message")) return false;
    var elem = document.getElementById("message");
    elem.style.position = "absolute";
    elem.style.top = "50px";
    elem.style.left = "60px";
    elem.style.backgroundColor = "#ddf"
}
addLoadEvent(positionMessage) */
/* function positionMove() {
    if(!document.getElementById) return false;
    if(!document.getElementById("message")) return false;
    var elem = document.getElementById("message");
    elem.style.left = "260px";
} */
function moveMessage(){
    if(!document.getElementById) return false;
    if(!document.getElementById("message")) return false;
    var elem = document.getElementById("message");
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    if(xpos == 200 && ypos == 100){
        return true;
    }
    if(xpos < 200){
        xpos++;
    }
    if(xpos > 200){
        xpos--;
    }
    if(ypos < 100){
        ypos++;
    }
    if(ypos > 100){
        ypos--;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    movement = setTimeout("moveMessage()", 10);
}

function positionMessage(){
    if(!document.getElementById) return false;
    if(!document.getElementById("message")) return false;
    var elem = document.getElementById("message");
    elem.style.position = "absolute";
    elem.style.left = "50px";
    elem.style.top = "100px";
    moveElement("message", 200, 100, 20);
}

addLoadEvent(positionMessage);

function stopMove(){
    clearTimeout(movement)
}

function moveElement(elementID, final_x, final_y, interval){
    if(!document.getElementById) return false;
    if(!document.getElementById(elementID)) return false;
    var elem = document.getElementById(elementID);
    xpos = parseInt(elem.style.left);
    ypos = parseInt(elem.style.top);
    if(xpos == final_x && ypos == final_y){
        return true;
    }
    if(xpos < final_x){
        xpos++;
    }
    if(xpos > final_x){
        xpos--;
    }
    if(ypos < final_y){
        ypos++;
    }
    if(ypos > final_y){
        ypos--;
    }
    elem.style.left = xpos + "px";
    elem.style.top = ypos + "px";
    // var repeat = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + ")";
    // 这里连接的字符串 elementID用了'' 因为line126 127引用它的时候，需要将它转为字符
    var repeat = "moveElement('" + elementID + "'," + final_x + "," + final_y + "," + interval + ")";
    movement = setTimeout(repeat, interval);
}
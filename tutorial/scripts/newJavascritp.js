function hightlightRows(){
    if(!document.getElementsByClassName) return false;
    var rows = document.getElementsByClassName("all");
    for (var i=0; i < rows.length; i++){
        rows[i].onmouseover = function(){
            this.style.fontWeight = "bold";
            this.style.color = "green";
            this.style.borderRadius = "1em"
        }
        rows[i].onmouseout = function(){
            this.style.fontWeight = "normal";
            this.style.color = "black";
            this.style.borderRadius = ".2em"
        }
    }
}
addLoadEvent(hightlightRows);
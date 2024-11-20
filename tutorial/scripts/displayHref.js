function displayHref(){
    if(!document.getElementsByTagName || !document.createElement || !document.createTextNode) return false;
    //取得网页内所有链接
    var nav = document.getElementById("navigation");
    var links = nav.getElementsByTagName("a");
    //创建一个数组 保存访问键
    var akeys = new Array();
    //遍历链接
    for(var i=0; i < links.length; i++){
        var current_link = links[i];
        //检查是否由accesskey 没有继续下一个
        if(!current_link.getAttribute("href")) continue;
        //取得accesskey的值
        var key = current_link.getAttribute("href");
        //取得链接文本
        var text = current_link.lastChild.nodeValue;
        //添加到数组
        // akeys[key] = text;
        //把链接分别显示到每个a标签的下面，不重新创建列表
        var para = document.createElement("p");
        var str = text+ ":" + key;
        var para_text = document.createTextNode(str);
        para.appendChild(para_text);
        var parent = current_link.parentNode;
        parent.appendChild(para);
    }
    //创建列表
    /* var list = document.createElement("ul");
    //遍历访问键
    for(key in akeys){
        var text = akeys[key];
        //创建放到列表项中的字符串
        var str = key + ":" + text;
        //创建列表项
        var item = document.createElement("li");
        var item_text = document.createTextNode(str);
        item.appendChild(item_text);
        //把列表项添加到列表中
        list.appendChild(item);
    }
    //创建标题
    var header = document.createElement("h3");
    var header_text = document.createTextNode("Hreflinks");
    header.appendChild(header_text);
    //把标题添加到页面主体
    document.body.appendChild(header);
    //把列表添加到页面主体
    document.body.appendChild(list);
 */

    /* var paras = document.getElementsByTagName("p");
    for(var i = 0; i < paras.length; i++){
        paras[i].onclick = function(){
            alert("You clicked on a paragraph ");
        }
    } */
    
}
function clickA(){
var paraE = document.getElementById("pe");
    paraE.onclick = function() {
        alert("You stepped on Pe.");
    }
}
addLoadEvent(displayHref);
addLoadEvent(clickA);


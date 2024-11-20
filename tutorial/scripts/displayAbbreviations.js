function displayAbbreviations(){
    if(!document.getElementsByTagName) return false;
    if(!document.createElement) return false;
    if(!document.createTextNode) return false;
    var abbreviations = document.getElementsByTagName("abbr");
    if(abbreviations.length < 1) return false;
    var defs = new Array();
    for(var i = 0; i < abbreviations.length; i++){
        var current_abbr = abbreviations[i];
        if(current_abbr.childNodes.length < 1) continue; 
        //如果当前元素没有子节点，就立刻开始下一次循环。
        var definition = current_abbr.getAttribute("title");
        var key = current_abbr.lastChild.nodeValue;
        defs[key] = definition;
    }

   /*  for(var i = 0; i < abbreviations.length; i++){
        defs[abbreviations[i].lastChild.nodeValue] = abbreviations[i].getAttribute("title");
   } */
  //创建定义列表
  var dlist = document.createElement("dl");
  //遍历所有定义
  for (key in defs) {
    var definition = defs[key];
    //创建定义标题
    var dtitle = document.createElement("dt");
    var dtitle_text = document.createTextNode(key);
    dtitle.appendChild(dtitle_text);
    //创建定义描述
    var ddesc = document.createElement("dd");
    var ddesc_text = document.createTextNode(definition);
    ddesc.appendChild(ddesc_text);
    //添加到定义列表
    dlist.appendChild(dtitle);
    dlist.appendChild(ddesc);
  }
  //如果没有子节点 执行下一次。
  if(dlist.childNodes.length < 1) return false;
  var header = document.createElement("h2");
  var header_text = document.createTextNode("Abbreviations");
  header.appendChild(header_text)
  document.body.appendChild(header);
  document.body.appendChild(dlist);
}

addLoadEvent(displayAbbreviations);
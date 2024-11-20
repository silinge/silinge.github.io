function getNewContent(){
    var request = getHTTPObject();
    if(request){
        request.open("GET", "example.txt", true);
        request.onreadystatechange = function(){
            if (request.readyState == 4){
                alert("Request Received");
                var para = document.createElement("p");
                var txt = document.createTextNode(request.responseText);
                para.appendChild(txt);
                document.getElementById('new').appendChild(para);
            }
        };
        request.send(null);
    }else{
        alert("Sorry, your browser doesn\'t support XMLHTTPRequest");
    }
    alert("Function Done");
}

addLoadEvent(getNewContent);

/* 0=未初始化
1=正在加载
2=加载完毕
3=正在交互
4=完成

/代表根目录;

../代表上一级目录;

../../代表上两级目录;

/..代表下级目录;

/../..代表下两级目录.

同级 直接引用文件名 

<img src='katana.jpg'/>

下级 同级目录/下级目录/文件名

<img src='bl9u.katana.jpg'/>

 */
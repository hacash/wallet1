
var web = document.getElementById("web_wallet_iframe")


// 根据 iframe 内容高度设置 iframe 高度
function resizeIframe() {
  var idoc = web.contentDocument
  , hei = idoc.body.offsetHeight 
  web.style.height = hei + 'px';
}

// 监听 iframe 内容加载完成事件，并执行高度自适应
web.onload = resizeIframe;
setInterval(resizeIframe, 1000)

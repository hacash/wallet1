/**
 * 

cp -f ./pkg/hacash_sdk.js ./pkg/hacash_sdk.wasm ./pkg/hacash_sdk.zip  /home/jji/hacash/nodejs/wallet/v2.0/static/webwallet/lib/

node static/webwallet/parkage.node.js 

*/

const fs = require("fs")


// wasm


var wasm = fs.readFileSync(__dirname+"/lib/hacash_sdk.wasm")

// var atob = typeof window === 'undefined' ? atob : window.atob;
fs.writeFileSync(__dirname+"/lib/hacash_sdk_wasm.js", 
    `var hacash_sdk_wasm_code_base64 = "` +
    wasm.toString('base64')+
    `";
function base64ToBuffer(b) {
    var str = atob(b)
    , strlen = str.length
    , spx = strlen / 100
    , buffer = new Uint8Array(strlen);
    for (var i=0; i < strlen; i++) {
        buffer[i] = str.charCodeAt(i);
    }
    return buffer;
}
var parse_hacash_sdk_wasm_code = function() {
    return base64ToBuffer(hacash_sdk_wasm_code_base64);
}
`
)



/*** parkage *** */



var html = fs.readFileSync(__dirname+"/hacash_wallet.html") + ''
// console.log(html+'')

var insert_cons = {
    
    '<link rel="stylesheet" href="./lib/index.css">': 
    fs.readFileSync(__dirname+"/lib/index.css") + '',

    '<!--<script src="./lib/hacash_sdk_wasm.js"></script>-->': 
    fs.readFileSync(__dirname+"/lib/hacash_sdk_wasm.js") + '',

    '<script src="./lib/hacash_sdk.js"></script>': 
    fs.readFileSync(__dirname+"/lib/hacash_sdk.js") + '',
    
    '<script src="./lib/index.js"></script>': 
    fs.readFileSync(__dirname+"/lib/index.js") + '',

}


// replace online js lib
var online_scripts = [
    '<script src="/jslib/axios.min.js"></script>',
    '<script src="./lib/jszip.min.js"></script>',
    '<script src="./lib/hacash_sdk_download.js"></script>',
]
for(var i in online_scripts){
    var li = online_scripts[i]
    html = html.replace(li, '')
}


// insert code
for(var k in insert_cons){
    var li = insert_cons[k]
    if(k.indexOf('.css') > 0){
        li = '<style>'+li+'</style>'
    }else{
        li = '<script>'+li+'</script>'
    }
    html = html.replace(k, li)
}


fs.writeFileSync(__dirname+"/hacash_web_page_wallet.html", html)

// console.log(html+'')


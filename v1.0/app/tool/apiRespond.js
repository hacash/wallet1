
function writeHead(res){
    res.writeHead(200,{
        "Content-Type":" application/json;charset=UTF-8", 
        // "Access-Control-Allow-Origin": "*", 
        // "Access-Control-Allow-Methods": "GET, POST"
    });
}



///////////////////////////////////////////



exports.success = function (res, dataobj) {
    writeHead(res)
    dataobj.ret = 0
    let str = JSON.stringify(dataobj)
    res.end(str)
}

exports.error = function (res, obj) {
    writeHead(res)
    let str = JSON.stringify({
        ret: 1,
        msg: obj
    })
    res.end(str)
}

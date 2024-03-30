const url = require('url')
const http = require("http")
const https = require("https")


exports.parsePostData = async function(ctx){
    return new Promise((resolve,reject)=>{
      try{
        let postData=''
        ctx.req.addListener('data',(data)=>{
          postData+=data
        })
        ctx.req.on('end', ()=>{
          try{
            postData = JSON.parse(postData)
          }catch(e){}
          resolve(postData)
        })
      }catch(err){
        reject(err)
      }
    })
  }

exports.readPostData = async function(ctx){
    return new Promise((resolve,reject)=>{
        try{
            let postData=''
            ctx.req.addListener('data',(data)=>{
                postData += data
            })
            ctx.req.on('end', ()=>{
                resolve(postData)
            })
        }catch(err){
            reject(err)
        }
    })
}

exports.parseJsonPostData = async function(ctx){
    return new Promise((resolve,reject)=>{
        try{
            let postData=''
            ctx.req.addListener('data',(data)=>{
                postData+=data
            })
            ctx.req.on('end', ()=>{
                try{
                    postData = JSON.parse(postData)
                }catch(e){}
                resolve(postData)
            })
        }catch(err){
            reject(err)
        }
    })
}



exports.json = function(url, opts) {
    opts = opts || {}
    let http_obj = opts.https ? https : http
    return new Promise( (ok, err) => {
        http_obj.get(url, (res) => {
            var str = ''
            res.on('data', (part) => {
                var sstr = part.toString()
                str += sstr
                // console.log(sstr)
            })
            res.on('end', () =>  {
                try{
                    // console.log(str)
                    var data = JSON.parse(str)
                    // console.log(data)
                    ok(data)
                }catch(e){
                    err("res str is not json: "+str)
                }
            })
        })
    })
}

exports.reqPostApi = async function (urlstr, postdata) {

    return new Promise((ok, err)=>{

        let urlobj = url.parse(urlstr)
        urlobj.method = 'POST'
        urlobj.headers = {
            'Content-Length': postdata.length
        }
        let http_req = http.request(urlobj, function(http_res){
            var chunks = [];
            http_res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            http_res.on('end', () => {
                let resstr = Buffer.concat(chunks).toString()
                try{
                    // console.log(resstr)
                    let resobj = JSON.parse(resstr)
                    // console.log(resobj)
                    resobj.ret = 0
                    ok(resobj)
                }catch(e){
                    // console.log(e)
                    err(resstr)
                }
            })
        })
        http_req.on('error', function(e){
            // console.log(e)
            err("api error:" + e.toString() )
        })
        // console.log(postdata)
        http_req.write(postdata)
        http_req.end();
    })
}


exports.reqFuncOfNodeApiOperate = function(cnf, type, datas, params) {
    // console.log(txbody)
    let url = cnf.hcx_node_api_url + '/operate?'
    params = params || {}
    for(var k in params){
        url += `${k}=${params[k]}&`
    }
    let contents = []
    contents.push( Buffer.from(type, 'hex') )
    contents.push( datas )
    let postdata = Buffer.concat(contents)
    // do post
    return exports.reqPostApi(url, postdata)
}


exports.allowCrossAccess = function(ctx) {
    ctx.append("Access-Control-Allow-Origin","*");
    ctx.append("Access-Control-Allow-Headers", "content-type");
    ctx.append("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
}
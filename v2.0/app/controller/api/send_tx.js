const http = require('http')
const url = require('url')
const toolhttp = require("./http.js")

module.exports = async function(cnf, ctx)
{

    let post = await toolhttp.parsePostData(ctx)

    //设置允许跨域的域名，*代表允许任意域名跨域
    ctx.append("Access-Control-Allow-Origin","*");
    //允许的header类型
    ctx.append("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    ctx.append("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");

    try{
        let txbody = post.txbody
        if(!txbody){
            return ctx.apiError("txbody must")
        }
        let resobj = await reqFuncToSendTx(cnf, txbody)
        ctx.apiData(resobj)
    }catch(e){
        // console.log(e)
        ctx.apiError(e.toString())
    }
}


function reqFuncToSendTx(cnf, txbody) {
    return new Promise((ok, err)=>{

        let contents = []
        // console.log(txbody)
        contents.push( Buffer.from('00000001', 'hex') )
        contents.push( Buffer.from(txbody, 'hex') )
        contents = Buffer.concat(contents)
        let urlobj = url.parse(cnf.hcx_node_api_url + '/operate')
        urlobj.method = 'POST'
        urlobj.headers = {
            'Content-Length': contents.length
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
                    // let errmsg = resstr.toLocaleLowerCase().replace(/\s+/ig, "")
                    // if(errmsg.includes("feepurity")>0){
                    //     resstr = "交易已经存在于交易池，正在等待确认，请勿重复添加"
                    // }else if(resstr.includes("exist")>0){
                    //     resstr = "交易已经被确认，转账成功。"
                    // }
                    // console.log(e)
                    err(resstr)
                }
            })
        })
        http_req.on('error', function(e){
            // console.log(e)
            err("api error:" + e.toString() )
        })
        // console.log(contents)
        http_req.write(contents)
        http_req.end();
    })
}
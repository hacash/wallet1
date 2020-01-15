
const api = appload('tool/apiRespond')
const toolhttp = appload('tool/http')
const http = require('http')
const url = require('url')


const config = appload('config')



module.exports = async function(req, res)
{
    try{
        let txbody = req.body.txbody
        if(!txbody){
            return api.error(res, "txbody must")
        }
        let contents = []
        // console.log(txbody)
        contents.push( Buffer.from('00000001', 'hex') )
        contents.push( Buffer.from(txbody, 'hex') )
        contents = Buffer.concat(contents)
        let urlobj = url.parse(config.hcx_node_api_url + '/operate')
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
                    api.success(res, resobj)
                }catch(e){
                    let errmsg = resstr.toLocaleLowerCase().replace(/\s+/ig, "")
                    if(errmsg.includes("feepurity")>0){
                        resstr = "交易已经存在于交易池，正在等待确认，请勿重复添加"
                    }else if(resstr.includes("exist")>0){
                        resstr = "交易已经被确认，转账成功。"
                    }
                    // console.log(e)
                    api.error(res, resstr)
                }
            })
        })
        http_req.on('error', function(e){
            // console.log(e)
            api.error(res, "api error 2")
        })
        // console.log(contents)
        http_req.write(contents)
        http_req.end();
    }catch(e){
        // console.log(e)
        api.error(res, "api error 1")
    }
}

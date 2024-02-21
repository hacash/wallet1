const http = require('http')
const url = require('url')
const util = require("./util.js")

module.exports = async function(cnf, ctx)
{
    util.allowCrossAccess(ctx)

    let post = await util.parsePostData(ctx)
    
    try{
        let txbody = post.txbody
        if(!txbody){
            return ctx.apiError("txbody must")
        }
        txbody = Buffer.from(txbody, 'hex')
        let resobj = await util.reqFuncOfNodeApiOperate(cnf, '00000001', txbody)
        // let resobj = await reqFuncToSendTx(cnf, txbody)
        ctx.apiData(resobj)
    }catch(e){
        // console.log(e)
        ctx.apiError(e.toString())
    }
}

const http = require('http')
const url = require('url')
const util = require("./util.js")

module.exports = async function(cnf, ctx)
{
    util.allowCrossAccess(ctx)

    // let post = await util.parsePostData(ctx)
    let params = ctx.query || {};
    try{
        let txbody = await util.readPostData(ctx)
        // console.log('actjson: ', actjson)
        let resd = await util.reqFuncOfNodeApiOperate(
            cnf, '00000003', Buffer.from(txbody, 'hex'), params)
        ctx.apiData(resd)
    }catch(e){
        // console.log(e)
        ctx.apiError(e.toString())
    }
}

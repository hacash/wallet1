const http = require('http')
const url = require('url')
const util = require("./util.js")

module.exports = async function(cnf, ctx)
{
    util.allowCrossAccess(ctx)

    // let post = await util.parsePostData(ctx)

    try{
        let actjson = await util.readPostData(ctx)
        // console.log('actjson: ', actjson)
        let resd = await util.reqFuncOfNodeApiOperate(
            cnf, '00000002', Buffer.from(actjson, 'utf-8'))
        ctx.apiData(resd)
    }catch(e){
        // console.log(e)
        ctx.apiError(e.toString())
    }
}

const util = require('./util.js')



module.exports = async function(cnf, ctx)
{
    try{
        let txhash = ctx.query.txhash
        if(!txhash){
            return ctx.apiError("txhash must")
        }
        let url = cnf.hcx_node_api_url + '/query?action=txconfirm'
        +'&txhash='+ctx.query.txhash
        // console.log(url)
        let obj = await util.json(url)
        if(obj.err){
            ctx.apiError(obj.err)
        }else{
            ctx.apiData(obj)
        }
    }catch(e){
        ctx.apiError(e.toString())
    }
}

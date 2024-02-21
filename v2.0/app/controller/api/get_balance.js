const util = require("./util.js")

module.exports = async function(cnf, ctx)
{
    let adds = ctx.query.address

    try{
        let obj = await util.json(cnf.hcx_node_api_url + '/query?action=balance&address='+adds)
        // console.log(obj)
        ctx.apiData( obj )
    }catch(e){
        ctx.apiError( e.toString() )
    }
}

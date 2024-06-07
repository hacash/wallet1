const util = require("./util.js")

module.exports = async function(cnf, ctx)
{
    let q = ctx.query || {}

    try{
        let url = cnf.hcx_node_api_url + '/query?action=raisetxfee'
        let qs = []
        for(var k in q){
            qs.push(`&${k}=${q[k]}`)
        }
        url += qs.join('&')
        let obj = await util.json(url)
        // console.log(obj)
        ctx.apiData( obj )
    }catch(e){
        ctx.apiError( e.toString() )
    }
}

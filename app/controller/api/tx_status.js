const api = appload('tool/apiRespond')
const toolhttp = appload('tool/http')
const config = appload('config')

module.exports = async function(req, res)
{
    try{
        let txhash = req.query.txhash
        if(!txhash){
            return api.error(res, "txhash must")
        }
        let url = config.hcx_node_api_url + '/query?action=txconfirm'
        +'&txhash='+req.query.txhash
        // console.log(url)
        let obj = await toolhttp.json(url)
        if(obj.err){
            api.error(res, obj.err)
        }else{
            api.success(res, obj)
        }
    }catch(e){
        api.error(res, e)
    }
}

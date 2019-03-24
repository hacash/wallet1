
const api = appload('tool/apiRespond')
const toolhttp = appload('tool/http')

const config = appload('config')



module.exports = async function(req, res)
{
    let adds = req.query.address

    try{
        let obj = await toolhttp.json(config.hcx_node_api_url + '/query?action=balance&address='+adds)
        // console.log(obj)
        obj.ret = 0
        api.success(res, obj)
    }catch(e){
        api.error(res, "")
    }
}

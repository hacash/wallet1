const api = appload('tool/apiRespond')
const toolhttp = appload('tool/http')
const config = appload('config')

module.exports = async function(req, res)
{
    try{
        let psstr = req.body.password
        if(!psstr){
            return api.error(res, "password must")
        }
        let url = config.hcx_node_api_url + '/query?action=createtx'
        +'&from='+req.body.from_addr
        +'&to='+req.body.to_addr
        +'&amount=HCX'+req.body.amount+':'+req.body.unit
        +'&fee=HCX'+req.body.fee+':'+req.body.fee_unit
        +'&password='+encodeURIComponent(req.body.password)
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


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
        let fee = req.body.fee
        fee = (fee+"").replace("ㄜ", "HAC")
        let url = config.hcx_node_api_url + '/query?action=quotefee'
        +'&txhash='+req.body.txhash
        +'&fee='+fee
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

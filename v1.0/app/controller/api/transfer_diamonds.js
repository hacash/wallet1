
const api = appload('tool/apiRespond')
const toolhttp = appload('tool/http')

const config = appload('config')




module.exports = async function(req, res)
{


    try{
        if(!req.body.fee_password){
            return api.error(res, "fee_password must")
        }
        if(!req.body.diamond_password){
            return api.error(res, "diamond_password must")
        }
        if(!req.body.to_address){
            return api.error(res, "to_address must")
        }
        if(!req.body.diamonds){
            return api.error(res, "diamonds must")
        }
        let url = config.hcx_node_api_url + '/query?action=transferdiamonds'
        +'&to_address='+req.body.to_address
        +'&diamonds='+req.body.diamonds
        +'&fee_password='+encodeURIComponent(req.body.fee_password)
        +'&diamond_password='+encodeURIComponent(req.body.diamond_password)
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

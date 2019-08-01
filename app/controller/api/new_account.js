
const api = appload('tool/apiRespond')
const toolhttp = appload('tool/http')

const config = appload('config')



module.exports = async function(req, res)
{
    try{
        let password = req.body.password
        let obj
        if(password){
            obj = await toolhttp.json(config.hcx_node_api_url + '/query?action=passwd&password='+encodeURIComponent(password))
        }else{
            obj = await toolhttp.json(config.hcx_node_api_url + '/query?action=newacc')
        }
        // console.log(obj)
        obj.ret = 0
        api.success(res, obj)
    }catch(e){
        console.log(e)
        api.error(res, e)
    }
}

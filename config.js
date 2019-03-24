const config = {
    http_port: 8000,
    watch_restart_timeout: 3,
    lang: 'zh', // 默认语言
    /////////////////////////////

    hcx_node_api_url: 'http://node2.hacash.org:3338',

}




//////////////////////////////////




try{
    let dev = require('./config.use.js')
    for(let i in dev){
        config[i] = dev[i]
    }
}catch(e){}


module.exports = config

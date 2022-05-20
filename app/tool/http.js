const http = require("http")
const https = require("https")

exports.json = function(url, querys, opts) {
    opts = opts || {}
    let http_obj = opts.https ? https : http
    return new Promise( (ok, err) => {
        http_obj.get(url, (res) => {
            var str = ''
            res.on('data', (part) => {
                var sstr = part.toString()
                str += sstr
                // console.log(sstr)
            })
            res.on('end', () =>  {
                try{
                    // console.log(str)
                    var data = JSON.parse(str)
                    // console.log(data)
                    ok(data)
                }catch(e){
                    err("res str is not json: "+str)
                }
            })
        })
    })
}

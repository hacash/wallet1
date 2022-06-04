const http = require("http")
const https = require("https")


exports.parsePostData = async function(ctx){
    return new Promise((resolve,reject)=>{
      try{
        let postData=''
        ctx.req.addListener('data',(data)=>{
          postData+=data
        })
        ctx.req.on('end', ()=>{
          try{
            postData = JSON.parse(postData)
          }catch(e){}
          resolve(postData)
        })
      }catch(err){
        reject(err)
      }
    })
  }


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
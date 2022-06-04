exports.parseJsonPostData = async function(ctx){
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
    
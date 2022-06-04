const util = require('../util')

module.exports = async function(cnf, ctx){

    // ctx.apiError(res.err)
    let postdata = util.parseJsonPostData(ctx)
    console.log(postdata)
    
    ctx.apiData( {abc: 123} )
}
    
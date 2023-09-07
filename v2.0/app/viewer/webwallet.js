
    
exports.components = [
    'html',
    'header',

    'web',

    'footer',
    'tail',
]


exports.datas = async function(cnf, ctx)
{
    // let data_types = await ddd.getTypes()
    // console.log(ctx.req, ctx.query)
    var q = ctx.query || {}
    var chain_id = undefined
    , chain_name = ''
    if(q.chain_id > 0) {
        chain_id = q.chain_id
        chain_name = q.chain_name
    }

    return {
        // isMobile: types.isMobile(ctx.req),
        // numToThousands: utilnumber.numToThousands,
        chain_id: chain_id,
        chain_name: chain_name,
        title: "Web Wallet"
    }
}

    
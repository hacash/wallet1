/**
 * 
 */




exports.components = [
    'header',

    'main_zh',

    'footer',
]



exports.datas = function(query, callback, req, res)
{
    callback(null, {
        pagetitle: res.lang.words.wallet + " - Hacash",
    })
}




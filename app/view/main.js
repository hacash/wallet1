/**
 * 
 */




exports.components = [
    'header',

    'main',

    'footer',
]



exports.datas = function(query, callback, req, res)
{
    callback(null, {
        pagetitle: res.lang.words.wallet + " - Hacash - HCX",
    })
}




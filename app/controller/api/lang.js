/**
 * 
 */

const api = appload('tool/apiRespond')

module.exports = function(req, res)
{
    let ty = req.query.set
    if( ! ty ){
        return api.error(res, "lang not set")
    }
    res.cookie('lang', ty);
    api.success(res, {lang: ty})
}

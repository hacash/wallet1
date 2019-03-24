/**
 *
 */

const path = require('path')

const routes = require('./routes.js');
const viewer = require('./viewer.js');
const config = require('../config.js');

const toolfs = require('./tool/fs.js')


module.exports = function(app)
{
    // lang
    app.use(function(req, res, next){
        let ty = config.lang || 'zh'
        if(req.cookies){
            ty = res.lang_type = req.cookies.lang || ty
        }
        res.lang = loadLanguage(ty)
        // console.log(res.lang)
        next()
    })
    // routes
    for(let i in routes){
        var isPost = false
        if(i.startsWith('POST')){
            isPost = true
        }
        const ctrl = require('./controller/'+routes[i]+'.js')
        if (isPost){
            i = i.substr(4)
            app.post(i, ctrl)
        }else{
            app.get(i, ctrl)
        }
    }
    // views compile
    viewer.compile({})
}


// 加载语言
const loadLanguageCache = {}
function loadLanguage(type) {
    if( loadLanguageCache[type] ) {
        return loadLanguageCache[type] 
    }
    const langs = {}
    let folders = loadLanguageItem(langs, './language/'+type)
    for(let i in folders){
        let one = folders[i]
        , bsk = path.basename(one).replace('.js', '')
        loadLanguageItem(langs, one, bsk)
    }
    // console.log(langs)
    loadLanguageCache[type] = langs
    return langs
}
function loadLanguageItem(langs, dir, bsk) {
    const flist = toolfs.scan(dir)
    for(let i in flist.files){
        let one = flist.files[i]
        , key = path.basename(one).replace('.js', '')
        , lobj = require(one.replace('./language/', '../language/'))
        // console.log('files', i, key, one)
        if(bsk){
            langs[bsk] = langs[bsk] || {}
            langs[bsk][key] = lobj
        }else{
            langs[key] = lobj
        }
    }
    return flist.folders
}




////////////////////// loader //////////////////////



global.appload = function(path) {
    if(path=="config"){
        return require("../config.js")
    }
    // others
    if( !path.startsWith('../') && !path.startsWith('./') ){
        path = './' + path
    }
    if( ! path.endsWith('.js') ){
        path += '.js'
    }
    return require(path)
}



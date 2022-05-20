/**
 * 
 */
const fs = require('fs')
const toolfs = require('./tool/fs.js')
const tooltppl = require('./tool/tppl.js')
const tplCache = {}

function readComponentFiles(names, ext){
    let files = names.map(function(x){
        var filename = x.indexOf('/')>0 ? 'index' : x
        return `./app/component/${x}/${filename}.${ext}`
    })
    return toolfs.readsSync(files, {ignore: true, merge: true})
}

function compileJsCssTpl(vname, view){
    let jscon = readComponentFiles(['html', ...view.components, 'tail'], 'js')
    fs.writeFileSync(`./static/jscss/${vname}.js`, jscon)
    let csscon = readComponentFiles(['html', ...view.components, 'tail'], 'css')
    fs.writeFileSync(`./static/jscss/${vname}.css`, csscon)
    return readComponentFiles(['html', ...view.components, 'tail'], 'htm')
}

exports.compile = function(conf)
{
    const flist = toolfs.scan('./app/view')

    for(let i in flist.files){
        let one = flist.files[i].replace('./app/', './')
        , vname = one.substr(7).split('.')[0]
        , view = require(one)
        , tpls = compileJsCssTpl(vname, view)
        tplCache[vname] = {
            datagen: view.datas,
            tplfunc: tooltppl(tpls),
        }
    }
}

exports.render = function(vname, query, req, res)
{
    const view = tplCache[vname]

    // console.log(view)
    if(!view){
        throw `not find view <${vname}>`
    }

    view.datagen(query, function(err, data){
        if(err){
            res.end('[500] error: '+err)
        }
        // render
        let datas = Object.assign({
            lang: res.lang, // 语言
            page_vname: vname,
        }, data)
        res.end( view.tplfunc(datas) )
    }, req, res)
}

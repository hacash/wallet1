/**
 *
 */


//
const express = require('express')

const config = require('./config.js')
const baseApp = require('./app/app.js')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());

app.use(express['static']('static'));

baseApp(app);

app.listen(config.http_port, function(){
    if(config.watch_restart_timeout>=10){
        console.log(`app listening on port ${config.http_port}!`)
    }
});

// 退出
process.on('exit', function(){
})

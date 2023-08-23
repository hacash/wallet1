// test
// document.getElementById("init").className = "ok";

// getElementsByClassName one
function $id(a) {
    return document.getElementById(a)
}
function $cno(a, n) {
    return a.getElementsByClassName(n)[0]
}


var $load = $id('load')
, $load_box = $cno($load, 'box')
, $load_loading = $cno($load, "loading")
, $load_progress = $cno($load, "progress")
, $load_bar = $cno($load_progress, "slider")
, $load_pgt = $cno($load, "pgt")
, $load_tips = $cno($load, "tips")
;

var $wlt = $id('wlt')

;

setTimeout(function(){
    $load_box.classList.remove('hide')
}, 5)

// loading progress
var is_progress_started = false
var hacash_sdk_loading_progress = function (percent) {
    console.log(percent)
    if(!is_progress_started){
        $load_loading.style.display = 'none'
        $load_progress.style.display = 'block' 
        $load_tips.innerText = 'Loading wallet program, please wait...'
        is_progress_started = true 
    }
    var peri = parseInt(percent)
    $load_bar.style.width = percent + "%";
    $load_pgt.innerText = peri + "%";
    if(peri == 70){
        $load_tips.innerText = ' Loading will be completed soon...'
    }
    if(peri == 95){
        $load_tips.innerText = 'Loading completed'
    }
    if(peri >= 100){
        loadFinishShowWallet()
    }
    // console.log(percent)
}

function loadFinishShowWallet(){
    $load_pgt.innerText = "Completed";
    $load_tips.innerText = 'Initializing program...'
    $load_progress.classList.add('hide')
    setTimeout(function(){
        $load_box.classList.add('hide')
        setTimeout(function(){
            $load.style.display = 'none'
            $wlt.style.display = 'block'
            $wlt.classList.remove('hide')
        }, 800)
    }, 1000) 
}



// check WebAssembly
var WebAssemblyIsOK = false
if(!WebAssembly || !WebAssembly.Instance || !WebAssembly.Module) {
    $init.innerHTML = "<div style='padding: 40px 20px; background: brown; color: azure; font-size: 18px; font-weight: bold;'>NOT support WebAssembly! Your browser version is too old, please upgrade your browser to the latest version.</div>"
}else{
    WebAssemblyIsOK = true
    function buildWasm(hacash_sdk_wasm_code) {
        // console.log(hacash_sdk_wasm_code)
        var go = new Go();
        WebAssembly.instantiate(hacash_sdk_wasm_code, go.importObject).then(function({module, instance}){
            go.run(instance);
            hacash_wallet_main(instance.exports);
        });
    }
    if(window.hacash_sdk_wasm_code_callback) {
        
        hacash_sdk_wasm_code_callback(buildWasm, hacash_sdk_loading_progress)

    }else if(window.parse_hacash_sdk_wasm_code) {
        
        var hacash_sdk_wasm_code = parse_hacash_sdk_wasm_code()
        // console.log(hacash_sdk_wasm_code)
        buildWasm(hacash_sdk_wasm_code)
        loadFinishShowWallet()

    }else if(window.hacash_sdk_wasm_code) {

        // alert('window.hacash_sdk_wasm_code')
        // console.log(hacash_sdk_wasm_code)
        buildWasm(hacash_sdk_wasm_code)
        loadFinishShowWallet()
    
    }
}


/**
 * CreateNewRandomAccount
 * GetAccountByPrivateKeyOrPassword
 * CreateHacTransfer
 * CreateHacdTransfer
 * 
 * 
 */


// start
function hacash_wallet_main(wasm){
    if(!WebAssemblyIsOK){
        return
    }

    // test
    var acc = CreateNewRandomAccount()
    console.log(acc, acc.Address)

    // var acc = GetAccountByPrivateKeyOrPassword("123456")
    // console.log(acc, acc.Address)


    // init
    init_create_account()
    init_hac_transfer()
    init_hacd_transfer()

    // loading ok
    $load.classList.add("ok");

}

// hacd transfer
function init_hacd_transfer() {
    var $acc = document.getElementById("hacdtrs")
    , $ipt1 = $cno($acc, "ipt1")
    , $ipt2 = $cno($acc, "ipt2")
    , $ipt3 = $cno($acc, "ipt3")
    , $ipt4 = $cno($acc, "ipt4")
    , $ipt5 = $cno($acc, "ipt5")
    , $btn1 = $cno($acc, "btn1")
    , $btn2 = $cno($acc, "btn2")
    , $btn3 = $cno($acc, "btn3")
    , $offline = $cno($acc, "offline")
    , $success = $cno($acc, "success")
    , $box1 = $cno($acc, "box1")
    , $box2 = $cno($acc, "box2")
    , confirmTip = ""
    , txhash = ""
    , txbody = ""
    ;

    // 非在线模式
    if(window.location.host != "wallet.hacash.org") {
        $btn3.style.display = "none" // 隐藏提交交易按钮
        $offline.style.display = "block"
    }

    // submit tx
    $btn3.onclick = function() {
        if($btn3.classList.contains("ban")){
            return
        }
        if( !confirm(confirmTip + "\n\nOnce a transaction is committed to the blockchain, is it irreversible, Are you sure to submit?") ){
           return 
        }
        // 提交
        $btn3.classList.add("ban")
        // post
        axios.post("/api/send_tx", {
            txbody: txbody,
        }).then(function(r){
            $btn3.classList.remove("ban")
            console.log(r.data)
            if(r.data.ret == 0){
                $btn3.style.display = "none"
                $success.style.display = "block"
                $cno($success, "hx").innerText = txhash
            }else{
                alert(r.data.err)
            }
        }).catch(function(e){
            $btn3.classList.remove("ban")
            alert(e.toString())
        })
    }

    // set tx body
    function genTx(tx) {
        var a1 = tx.PaymentAddress
        , a2 = tx.CollectionAddress
        $cno($box2, "pay").innerText = a1
        $cno($box2, "get").innerText = a2
        $cno($box2, "num").innerText = tx.DiamondCount
        $cno($box2, "amt").innerText = tx.Diamonds
        $cno($box2, "fee").innerText = tx.Fee
        $cno($box2, "txhx").innerText = tx.TxHash
        $cno($box2, "txbody").innerText = tx.TxBody
        $box2.style.display = "block";
        $box1.style.display = "none";
        confirmTip = "Payment account " + a1 + " transfer HAC " + tx.Amount + " to address " + a2 + " (fee: "+tx.Fee+")"
        txhash = tx.TxHash
        txbody = tx.TxBody
    }

    // back
    $btn2.onclick = function(){
        $box1.style.display = "block";
        $box2.style.display = "none";
        $ipt1.value = "" // del password
    }

    // create tx
    $btn1.onclick = function(){
        var v1 = $ipt1.value
        , v2 = $ipt2.value
        , v3 = $ipt3.value
        , v4 = $ipt4.value
        , v5 = $ipt5.value
        ;
        if(v1.length >= 6 && v2.length>=32 && v2.length<=34 && v3.length>=6 && v4.length>0 && v5.length>0){}else{
            return alert("please fill the form correctly.")
        }
        // 创建交易
        var ret = CreateHacdTransfer(v1, v2, v3, v4, v5)
        console.log(ret)
        if(ret.Error) {
            return alert(ret.Error)
        }
        if(ret.Diamonds) {
            genTx(ret)
        }
    }

}


// hac transfer
function init_hac_transfer() {
    var $acc = document.getElementById("hactrs")
    , $ipt1 = $cno($acc, "ipt1")
    , $ipt2 = $cno($acc, "ipt2")
    , $ipt3 = $cno($acc, "ipt3")
    , $ipt4 = $cno($acc, "ipt4")
    , $btn1 = $cno($acc, "btn1")
    , $btn2 = $cno($acc, "btn2")
    , $btn3 = $cno($acc, "btn3")
    , $offline = $cno($acc, "offline")
    , $success = $cno($acc, "success")
    , $box1 = $cno($acc, "box1")
    , $box2 = $cno($acc, "box2")
    , confirmTip = ""
    , txhash = ""
    , txbody = ""
    ;

    // 非在线模式
    if(window.location.host != "wallet.hacash.org") {
        $btn3.style.display = "none" // 隐藏提交交易按钮
        $offline.style.display = "block"
    }

    // submit tx
    $btn3.onclick = function() {
        if($btn3.classList.contains("ban")){
            return
        }
        if( !confirm(confirmTip + "\n\nOnce a transaction is committed to the blockchain, is it irreversible, Are you sure to submit?") ){
           return 
        }
        // 提交
        $btn3.classList.add("ban")
        // post
        axios.post("/api/send_tx", {
            txbody: txbody,
        }).then(function(r){
            $btn3.classList.remove("ban")
            console.log(r.data)
            if(r.data.ret == 0){
                $btn3.style.display = "none"
                $success.style.display = "block"
                $cno($success, "hx").innerText = txhash
            }else{
                alert(r.data.err)
            }
        }).catch(function(e){
            $btn3.classList.remove("ban")
            alert(e.toString())
        })
    }

    // set tx body
    function genTx(tx) {
        var a1 = tx.PaymentAddress
        , a2 = tx.CollectionAddress
        $cno($box2, "pay").innerText = a1
        $cno($box2, "get").innerText = a2
        $cno($box2, "amt").innerText = tx.Amount
        $cno($box2, "fee").innerText = tx.Fee
        $cno($box2, "txhx").innerText = tx.TxHash
        $cno($box2, "txbody").innerText = tx.TxBody
        $box2.style.display = "block";
        $box1.style.display = "none";
        confirmTip = "Payment account " + a1 + " transfer HAC " + tx.Amount + " to address " + a2 + " (fee: "+tx.Fee+")"
        txhash = tx.TxHash
        txbody = tx.TxBody
    }

    // back
    $btn2.onclick = function(){
        $box1.style.display = "block";
        $box2.style.display = "none";
        $ipt1.value = "" // del password
    }

    // create tx
    $btn1.onclick = function(){
        var v1 = $ipt1.value
        , v2 = $ipt2.value
        , v3 = $ipt3.value
        , v4 = $ipt4.value
        ;
        if(v1.length >= 6 && v2.length>=32 && v2.length<=34 && v3.length>0 && v4.length>0){}else{
            return alert("please fill the form correctly.")
        }
        // 创建交易
        var ret = CreateHacTransfer(v1, v2, v3, v4)
        console.log(ret)
        if(ret.Error) {
            return alert(ret.Error)
        }
        if(ret.Amount) {
            genTx(ret)
        }
    }

}


// create account
function init_create_account() {
    var $acc = document.getElementById("acc")
    , $ipt1 = $cno($acc, "ipt1")
    , $btn1 = $cno($acc, "btn1")
    , $btn2 = $cno($acc, "btn2")

    var in1chg = function(){
        var v = $ipt1.value
        , len = v.length
        , hav = v.replace(/[A-Za-z0-9\~\!\@\#\$\%\^\&\*\_\+\-\=\,\.\:\;]+/ig, "")
        if(len >= 6 && len <= 255 && hav == "") {
            $btn2.classList.remove("ban")
        }else{
            $btn2.classList.add("ban")
        }
    }
    $ipt1.onkeyup = in1chg
    $ipt1.onchange = in1chg
    // result
    var result = function(acc, usepass) {
        var $res = $cno($acc, "result")
        , $mark =  $cno($res, "mark")
        , $b1 =    $cno($res, "addr")
        , $b2 =    $cno($res, "pubkey")
        , $b3 =    $cno($res, "prikey")
        ;   
        $mark.innerText = '( by '+ (usepass?('password '+usepass):'randomly') +' )'
        $b1.innerText = acc.Address
        $b2.innerText = acc.PublicKey
        $b3.innerText = acc.PrivateKey
        $res.classList.add("show")
    }
    // random create
    $btn1.onclick = function(){
        $ipt1.value = ""
        $btn2.classList.add("ban")
        $btn1.classList.add("ban")
        var acc = CreateNewRandomAccount()
        result(acc)
        $btn1.classList.remove("ban")
    }
    // password create
    $btn2.onclick = function(){
        if($btn2.classList.contains("ban")){
            return
        }
        var v = $ipt1.value
        , rm = v.replace(/[A-Za-z0-9\~\!\@\#\$\%\^\&\*\_\+\-\=\,\.\:\;]+/ig, "")
        if(v.length < 6 || v.length > 255){
            return alert("wrong password length")
        }
        if(rm != "") {
            return alert("unsupported symbol")
        }
        $btn1.classList.add("ban")
        var acc = GetAccountByPrivateKeyOrPassword(v)
        result(acc, v)
        $btn1.classList.remove("ban")
    }


    // test
    // $btn1.click()



}


/*
// auto iframe height
if(parent) {
    // alert("parent!")
    var web = parent.document.getElementById("web_wallet_iframe");
    console.log(web)
    console.log(document.body.scrollHeight)
    var upheifunc = function(){
        web.style.height = document.body.scrollHeight; 
    }
    upheifunc()
    setInterval(upheifunc, 1000)
}
*/


/*


function base64ToBuffer(b) {
    const str = window.atob(b);
    const buffer = new Uint8Array(str.length);
    for (let i=0; i < str.length; i++) {
        buffer[i] = str.charCodeAt(i);
    }
    return buffer;
}
var hacash_sdk_wasm_code = base64ToBuffer(hacash_sdk_wasm_code_base64);




function base64ToBuffer(b, progress_call) {
  var str = window.atob(b)
  , strlen = str.length
  , spx = strlen / 100
  , buffer = new Uint8Array(strlen);
  for (var i=0; i < strlen; i++) {
    buffer[i] = str.charCodeAt(i);
    if(i % spx == 0){
      var per = parseFloat(i) / parseFloat(strlen) * 100
      setTimeout(progress_call, 5, per)
    }
  }
  return buffer;
}

window.parse_hacash_sdk_wasm_code = function(progress_call) {
  return base64ToBuffer(hacash_sdk_wasm_code_base64, progress_call);
}






*/


// url
var HacashMinerNodeURL = "127.0.0.1:3338"


function $id(id){
    return document.getElementById(id)
}



function getScrollTop() {  
    var scrollPos;  
    if (window.pageYOffset) {  
    scrollPos = window.pageYOffset; }  
    else if (document.compatMode && document.compatMode != 'BackCompat')  
    { scrollPos = document.documentElement.scrollTop; }  
    else if (document.body) { scrollPos = document.body.scrollTop; }   
    return scrollPos;   
} 


function setCookie (cname, cvalue, path, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var path = "path=" + path;
    var ck = cname + "=" + cvalue + "; " + expires + "; " + path
    // console.info(ck);
    document.cookie = ck;
    // console.info(document.cookie);
}


function tppl(tpl, data){
  var fn =  function(d) {
      var i, k = [], v = [];
      for (i in d) {
          k.push(i);
          v.push(d[i]);
      };
      return (new Function(k, fn.$)).apply(d, v);
  };
  if(!fn.$){
      var tpls = tpl.split('{:');
      fn.$ = "var $=''";
      for(var t = 0;t < tpls.length;t++){
          var p = tpls[t].split(':}');
          if(t!=0){
              fn.$ += '='==p[0].charAt(0)
                ? "+("+p[0].substr(1)+")"
                : ";"+p[0].replace(/\r\n/g, '')+"$=$"
          }
          // 支持 <pre> 和 [::] 包裹的 js 代码
          fn.$ += "+'"+p[p.length-1].replace(/\'/g,"\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n')+"'";
      }
      fn.$ += ";return $;";
      // log(fn.$);
  }
  return data ? fn(data) : fn;
}


function apicallex(r, okcall, errcall) {
    if( ! r.data || typeof r.data === ''  ) {
        return errcall && errcall("cannot get data")
    }
    if ( typeof r.data === 'string' ) {
        return errcall && errcall(r.data)
    }
    var emsg = r.data.err || r.data.errmsg || ( r.data.ret > 0 ?  r.data.ret : '')
    if( emsg ) {
        errcall && errcall(emsg)
    }else{
        okcall && okcall(r.data)
    }
}

function apiget(url, data, okcall, errcall) {
    url = 'http://' + HacashMinerNodeURL + url
    console.log(url)
    axios
        .get(url, {
            params: data,
        })
        .then(function(r){
            apicallex(r, okcall, errcall)
        })
        .catch(errcall)
}


function apipost(url, data, okcall, errcall) {
    url = 'http://' + HacashMinerNodeURL + url
    console.log(url)
    axios
        .post(url, data)
        .then(function(r){
            apicallex(r, okcall, errcall)
        })
        .catch(errcall)
}


minerurl


/////////////////////////////////////////


var vAppMinerUrl = new Vue({
    el: '#minerurl',
    data: {
        ipport: HacashMinerNodeURL,
        useipport: HacashMinerNodeURL,
    },
    methods:{
        change: function(){
            HacashMinerNodeURL = this.ipport
            alert('Change full node url successfully!')
            this.useipport = this.ipport
        },
    }
})



var vAppDiamondsTransferTx = new Vue({
    el: '#transferdiamonds',
    data: {
        fee_password: "",
        diamond_password: "",
        to_address: "",
        diamonds: "",
        result: null,
    },
    methods:{
        transferDiamonds: function(){
            var that = this
            if(!that.fee_password || !that.diamond_password || !that.to_address || !that.diamonds){
                return alert("Please complete the form.")
            }
            apiget("/query?action=transferdiamonds", {
                to_address: that.to_address,
                diamonds: that.diamonds,
                fee_password: that.fee_password,
                diamond_password: that.diamond_password,
            }, function(data){
                if(data.status == "ok"){
                    that.fee_password = ""
                    that.diamond_password = ""
                    that.to_address = ""
                    that.diamonds = ""
                    that.result = null
                    alert("Diamond transfer succeeded!")
                }
            }, function(errmsg){
                that.result =   errmsg
            })
        }
    }
})



var vAppQuoteFeeTx = new Vue({
    el: '#quotefee',
    data: {
        txhash: "",
        fee: "",
        password: "",
        result: null,
    },
    methods:{
        quoteFee: function(){
            var that = this
            if(!that.txhash){
                return alert("Please enter transaction hash.")
            }
            if(!that.fee){
                return alert("Please enter the reset fee.")
            }
            if(!that.password){
                return alert("Please enter password or private key.")
            }
            apiget("/query?action=quotefee", {
                txhash: that.txhash,
                fee: that.fee,
                password: that.password,
            }, function(data){
                if(data.status == "ok"){
                    that.txhash = ""
                    that.fee = ""
                    that.password = ""
                    that.result = ""
                    alert("Modify fee successfully!")
                }
            }, function(errmsg){
                that.result =   errmsg
            })
        }
    }
})



var vAppTxStatus = new Vue({
    el: '#txstatus',
    data: {
        txhash: "",
        txhash_show: "",
        result: null,
    },
    methods:{
        statusTx: function(){
            var that = this
            that.txhash = that.txhash.replace(/[\s\n]+/ig, "")
            if(!that.txhash){
                return alert("Please enter transaction hash.")
            }
            apiget("/query?action=txconfirm", {
                txhash: that.txhash,
            }, function(data){
                // console.log(data)
                that.txhash_show = that.txhash+""
                that.txhash = ""
                that.result = data
            }, function(errmsg){
                that.result = {
                    err: errmsg
                }
            })
        },
    }
})




var vAppSendTx = new Vue({
    el: '#sendtx',
    data: {
        txbody: "",
        result: null,
    },
    methods:{
        sendTx: function(){
            var that = this
            that.txbody = that.txbody.replace(/[\s\n]+/ig, "")
            if(!that.txbody){
                return alert("Please enter transaction body.")
            }
            apipost("/operatehex", '00000001' + that.txbody, function(data){
                console.log(data)
                that.txbody = ""
                that.result = data // 提交成功
            }, function(errmsg){
                that.result = {
                    err: errmsg,
                }
            })
        }
    }
})


var vAppTransfer = new Vue({
    el: '#transfer',
    data: {
        step: 1,
        from_addr: "",
        to_addr: "",
        amount: "",
        unit: 248,
        fee: 10000,
        fee_unit: 240,
        password: "",
        txhash: "",
        txbody: "",
        // 
        txstatusupdatesec: 2, // 交易状态定时器
        txconfirm: null,
    },
    methods:{
        reset_all: function(){
            this.step = 1
            this.from_addr = ""
            this.to_addr = ""
            this.amount = ""
            this.unit = 248
            this.fee = 10000
            this.fee_unit = 240
            this.password = ""
            this.txhash = ""
            this.txbody = ""
            this.txstatusupdatesec = 2 // 交易状态定时器
            this.txconfirm = null
        },
        statusTx: function(){
            var that = this
            if(that.step!=4){
                return
            }
            that.txstatusupdatesec--
            if(that.txstatusupdatesec==3){
                that.txconfirm = null // 重置
            }
            if(that.txstatusupdatesec==1){
                // 更新状态
                apiget("/query?action=txconfirm", {
                    txhash: that.txhash,
                }, function(data){
                    that.txconfirm = data
                    if(data.status=='confirm'){
                        // 交易已被确认，do nothing
                        console.log(data)
                    }else{
                        that.txstatusupdatesec = 60
                        setTimeout(that.statusTx, 1000)
                    }
                })
            }else{
                setTimeout(that.statusTx, 1000)
            }
        },
        sendTx: function(){
            var that = this
            apipost("/operatehex", '00000001' + that.txbody, function(data){
                that.step = 4
                that.statusTx()
                console.log(data)
            }, function(errmsg){
                alert("Failed to send transaction: " + errmsg)
            })
        },
        createTx: function(){
            var that = this
            apiget("/query?action=createtx", {
                'from':that.from_addr,
                'to':that.to_addr,
                'amount':'HCX'+that.amount+':'+that.unit,
                'fee': 'HCX'+that.fee+':'+that.fee_unit,
                'password': (that.password),
            }, function(data){
                that.txhash = data.txhash
                that.txbody = data.txbody
                that.step = 3 // 下一步
            }, function(errmsg){
                alert("Failed to create transaction: " + errmsg)
            })
        },
        inputTx: function(){
            if( !this.from_addr || !this.to_addr || !this.amount ){
                return alert("Please improve the transaction content.")
            }
            if(this.amount.replace(/[0-9]+/,"") != ""){
                return alert("Transfer amount format error, only integer is supported. If the amount is less than one, please select the unit [铢(240)].")
            }
            this.step = 2
        },
        cancel: function(){
            if( confirm("Are you sure you want to cancel the transfer?") ){
                this.reset_all()
            }
        },
        close: function(){
            if( this.txconfirm && this.txconfirm.block_hash ) {
                return this.reset_all()
            }
            if( confirm("Waiting for transaction status update results, close?") ){
                this.reset_all()
            }
        },
    }
})


var vAppNewAccount = new Vue({
    el: '#newacc',
    data: {
        passstr: "",
        accobj: null,
    },
    methods:{
        newAccount: function(){
            var that = this
            , ps = that.passstr
            // 通过密码生成
            if(ps.length > 0){
                // 判断条件
                var hav = ps.replace(/[A-Za-z0-9\~\!\@\#\$\%\^\&\*\_\+\-\=\,\.\:\;]+/ig, "")
                if( hav != "" ){
                    return alert("Do not enter unsupported symbols.")
                }
                if( ps.length < 6 ){
                    return alert("Password cannot be less than 6 bits.")
                }
                if( ps.length > 128 ){
                    return alert("Password cannot be more than 256 bits.")
                }
                if( ps.length < 16 && ps.replace(/[a-z0-9]+/ig, "") == "" ){
                    if( !confirm("The password you set is too simple. It may be guessed by technology traversal. There is a potential risk of theft and loss of assets. Are you sure to continue?") ){
                        return
                    }
                }
            }else{
                // 随机生成私钥
            }
            // alert(lss)
            var userurl = ps ? 
                '/query?action=passwd' :
                '/query?action=newacc'
            apiget(userurl, {
                password: ps,
            }, function(data){
                // alert(data.address)
                data.passstr = that.passstr
                that.accobj = data
            }, function(err){
                alert("Creation failed:" + err.msg)
                that.accobj = null
            })
        }
    }
})




var vAppBalance = new Vue({
    el: '#balance',
    data: {
        addrs: "",
        balances: [],
        totalamt: "",
    },
    methods:{
        getBalance: function(){
            var that = this
            , lss = that.addrs.replace(/[\s,，]+/ig, ",").replace(/^,|,$/ig, "")
            if( ! lss){
                return "Please enter wallet address."
            }
            if( lss.split(",")>=20 ){
                return "No more than 20 wallet addresses."
            }
            // alert(lss)
            apiget("/query?action=balance", {
                address: lss,
            }, function(data){
                var amts = data.amounts.split("|")
                , adrs = lss.split(",")
                , bls = []
                for(var i in adrs){
                    bls.push({
                        addr: adrs[i],
                        amt: amts[i],
                    })
                }
                that.balances = bls // 显示
                that.totalamt = data.total
            }, function(err){
                alert("Query failed: " + err.msg)
                that.balances = []
            })
        }
    }
})



var vAppFooter = new Vue({
    el: '#footer',
    data: {
    }
})


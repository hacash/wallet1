/* index.js */

var createdAddr = null;
var walletLeaveTip = $id('hdrtip1').innerText;
var walletLeaveTip2 = $id('hdrtip2').innerText;
window.onbeforeunload=function(e){
    if(createdAddr){
        e = e || window.event || {}
        e.returnValue = walletLeaveTip
        return ifCreateWallet
    }
}



function createWalletRandom() {
    var genbtckey = new Bitcoin.ECKey(false)
    , address = genbtckey.getBitcoinAddressCompressed()
    , prikeys = bytesToHex(genbtckey.getBitcoinPrivateKeyByteArray())
    return {
        genbtckey: genbtckey,
        address: address,
        prikeys: prikeys,
    }
}

var vAppWallet = new Vue({
    el: '#wallet',
    data: {
        addr: "",
        prikey: "",
    },
    methods:{
        selectCopy: function(e) {
            var tarelm = e.target;
            // select
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.selectNodeContents(tarelm.firstChild);
            selection.addRange(range);
            // copy
            document.execCommand('copy');
        },
        create: function(){
            var t = this
            if(t.addr && !confirm(walletLeaveTip2)) {
                return
            }
            // 创建钱包地址
            setTimeout(function(){
                var addrobj = createWalletRandom()
                t.addr = addrobj.address;
                t.prikey = addrobj.prikeys;
                // set
                createdAddr = t.addr+''
            }, 30)
        }
    }
})
// vAppWallet.create()


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
            apiget("/api/get_balance", {
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
            apiget("/api/tx_status", {
                txhash: that.txhash,
            }, function(data){
                // console.log(data)
                that.txhash_show = that.txhash+""
                that.txhash = ""
                that.result = data
            }, function(errmsg){
                // console.log(errmsg)
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
            apipost("/api/send_tx", {
                txbody: that.txbody,
            }, function(data){
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





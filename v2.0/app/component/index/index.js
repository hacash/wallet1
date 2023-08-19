/* index.js */


var vAppBalance = new Vue({
    el: '#balance',
    data: {
        addrs: "",
        // addrs: "1MzNY1oA3kfgYi75zquj3SRUPYztzXHzK9,18Yt6UbnDKaXaBaMPnBdEHomRYVKwcGgyH",
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

// vAppBalance.getBalance()




var vAppTxStatus = new Vue({
    el: '#txstatus',
    data: {
        txhash: "",
        txhash_show: "",
        result: null,
        // txhash_show: "40e43b578ceddcaa82362878c06a18997256e1b59fba1c3566fbcd2bc7fb544d",
        // result: {status: "txpool"},
        // result: {err: "txpool"},

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
        // result: {ret:0, txhash: "40e43b578ceddcaa82362878c06a18997256e1b59fba1c3566fbcd2bc7fb544d"}
        // result: {ret:1, err: "Balance not enaght"}
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





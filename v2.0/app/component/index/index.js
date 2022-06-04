/* index.js */



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





/*


7F3FAC91802082EE90C5B3F5D63B0FB241A90569A427AF8FB9261BC6D991AC98

*/



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
            apipost("/api/transfer_diamonds", {
                fee_password: that.fee_password,
                diamond_password: that.diamond_password,
                to_address: that.to_address,
                diamonds: that.diamonds,
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
            apipost("/api/quote_fee", {
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
            apiget("/api/tx_status", {
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
                apiget("/api/tx_status", {
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
            apipost("/api/send_tx", {
                txbody: that.txbody,
            }, function(data){
                that.step = 4
                that.statusTx()
                // console.log(data)
            }, function(errmsg){
                alert("Failed to send transaction: " + errmsg)
            })
        },
        createTx: function(){
            var that = this
            apipost("/api/create_tx", vAppTransfer._data, function(data){
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
            apipost("/api/new_account", {
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
            apiget("/api/get_balance", {
                address: lss,
            }, function(data){
                var amts = data.amounts.split(",")
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



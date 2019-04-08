/*


7F3FAC91802082EE90C5B3F5D63B0FB241A90569A427AF8FB9261BC6D991AC98

*/



var vAppTxStatus = new Vue({
    el: '#txstatus',
    data: {
        txhash: "",
        result: null,
    },
    methods:{
        statusTx: function(){
            var that = this
            if(!that.txhash){
                return alert("请输入交易的 txhash")
            }
            apiget("/api/tx_status", {
                txhash: that.txhash,
            }, function(data){
                // console.log(data)
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
            if(!that.txbody){
                return alert("请输入交易的 txbody")
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
        amount: 0,
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
            this.amount = 0
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
                alert("发送交易失败：" + errmsg)
            })
        },
        createTx: function(){
            var that = this
            apipost("/api/create_tx", vAppTransfer._data, function(data){
                that.txhash = data.txhash
                that.txbody = data.txbody
                that.step = 3 // 下一步
            }, function(errmsg){
                alert("创建交易失败：" + errmsg)
            })
        },
        inputTx: function(){
            if( !this.from_addr || !this.to_addr || !this.amount ){
                return alert("请完善交易内容")
            }
            this.step = 2
        },
        cancel: function(){
            if( confirm("是否确认取消转账？") ){
                this.reset_all()
            }
        },
        close: function(){
            if( this.txconfirm && this.txconfirm.block_hash ) {
                return this.reset_all()
            }
            if( confirm("正在等待交易状态更新结果，是否关闭？") ){
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
            // 判断条件
            , hav = ps.replace(/[A-Za-z0-9\~\!\@\#\$\%\^\&\*\_\+\-\=\,\.\:\;]+/ig, "")
            if( hav != "" ){
                return alert("请勿输入不支持的符号")
            }
            if( ps.length<6 ){
                return alert("密码不能少于6位")
            }
            if( ps.length>128 ){
                return alert("密码不能多于128位")
            }
            // alert(lss)
            apipost("/api/new_account", {
                password: ps,
            }, function(data){
                // alert(data.address)
                that.accobj = data
            }, function(err){
                alert("创建失败：" + err.msg)
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
                return "请输入钱包地址"
            }
            if( lss.split(",")>=20 ){
                return "钱包地址不得超过20个"
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
                alert("查询失败：" + err.msg)
                that.balances = []
            })
        }
    }
})






var vAppBalance = new Vue({
    el: '#balance',
    data: {
        addrs: "",
        balances: [],
        totalamt: "",
        ///////////
        prev_addrs: "",
    },
    methods:{
        getBalance: function(){
            var that = this
            , lss = that.addrs.replace(/[\s,，]+/ig, ",").replace(/^,|,$/ig, "")
            if(that.prev_addrs == lss){
                return // 重复查询
            }
            if( ! lss){
                return "请输入钱包地址"
            }
            if( lss.split(",")>=20 ){
                return "钱包地址不得超过20个"
            }
            that.prev_addrs = lss
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



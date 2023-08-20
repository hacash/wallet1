

var createdAddr = null;
var walletLeaveTip = $id('hdrtip1').innerText;
var walletLeaveTip2 = $id('hdrtip2').innerText;
window.onbeforeunload = function(e){
    if(createdAddr){
        e = e || window.event || {}
        e.returnValue = walletLeaveTip
        return ifCreateWallet
    }
}

// show anim
setTimeout(function(){
    document.getElementsByClassName('card')[0].classList.remove('hide')
}, 100)



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

var vAppCreate = new Vue({
    el: '#create',
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
// vAppCreate.create()


var vAppHeader = new Vue({
    el: '#header',
    data: {
    },
    methods:{
        choiseLang: function(lang) {
            setCookie("lang", lang, "/", 1000)
            if(lang == "en") {
                window.location.href = "/"
            }else if(lang == "zh") {
                window.location.href = "/zh"
            }
        },
    },
})

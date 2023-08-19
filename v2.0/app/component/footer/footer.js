/* footer.js */

var $ft = document.getElementById("footer")
, $lkis = $ft.getElementsByClassName("lkls")
;

for(var i in $lkis) {
    var a = $lkis[i]
    a.innerText = a.href;
}


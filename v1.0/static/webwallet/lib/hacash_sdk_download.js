var hswccs = []
window.hacash_sdk_wasm_code_callback = function (func) {
    hswccs.push(func)
}

// download wasm zip
JSZipUtils.getBinaryContent('./lib/hacash_sdk_tiny.zip', {
    progress: function (event) {
        var call = window.hacash_sdk_loading_progress || function (){}
        call(parseFloat(event.percent))
    },
    callback: function (err, data) {
        if (err) {
            return alert(err.toString());
        }
        var zip = new JSZip();
        zip.loadAsync(data, {binary: true}).then(function (zip) {
            zip.file("hacash_sdk_tiny.wasm").async("uint8array").then(function (u8) {
                for (var i in hswccs) {
                    hswccs[i](u8)
                }
            });
        });
    }
})

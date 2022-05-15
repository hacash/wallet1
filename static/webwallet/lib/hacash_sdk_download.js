
var hswccs = []
window.hacash_sdk_wasm_code_callback = function (func) {
    hswccs.push(func)
}

// download wasm zip
JSZipUtils.getBinaryContent('./lib/hacash_sdk_tiny.zip', function (err, data) {
    // console.log(err)
    // console.log(data)
    if (err) {
        return alert(err.toString());
    }
    // resolve(data);
    var zip = new JSZip();
    zip.loadAsync(data).then(function (zip){
        // console.log(zip, zip.file("hacash_sdk_tiny.wasm"))
        zip.file("hacash_sdk_tiny.wasm").async("uint8array").then(function (u8) {
            for(var i in hswccs){
                // console.log(u8)
                hswccs[i](u8)
            }
        });
    });
})

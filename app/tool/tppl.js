/**
 * tppl.js 极致性能的 JS 模板引擎
 * Github：https://github.com/jojoin/tppl
 * 作者：杨捷  
 * 邮箱：yangjie@jojoin.com
 *
 * @param tpl {String}    模板字符串
 * @param data {Object}   模板数据（不传或为null时返回渲染方法）
 *
 * @return  {String}    渲染结果
 * @return  {Function}  渲染方法
 *
 */

module.exports = function(tpl, data){
  var fn =  function(d) {
      var i, k = [], v = [];
      for (i in d) {
          k.push(i);
          v.push(d[i]);
      };
      return (new Function(k, fn.$)).apply(d, v);
  };

  if(!fn.$){
      var tpls = tpl.split('[:');
      fn.$ = "var $=''";
      for(var t = 0;t < tpls.length;t++){
          var p = tpls[t].split(':]');
          if(t!=0){
              fn.$ += '='==p[0].charAt(0)
                ? "+("+p[0].substr(1)+")"
                : ";"+p[0].replace(/\r\n/g, '')+"$=$"
          }
          // 支持 <pre> 和 [::] 包裹的 js 代码
          fn.$ += "+'"+p[p.length-1].replace(/\'/g,"\\'").replace(/\r\n/g, '\\n').replace(/\n/g, '\\n').replace(/\r/g, '\\n')+"'";
      }
      fn.$ += ";return $;";
  }

  return data ? fn(data) : fn;
}

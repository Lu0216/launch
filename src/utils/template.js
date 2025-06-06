
export default function getTemplate(id, type) {
  var code = "<script type='text/javascript'>(function () {var s='_div_'+Math.random().toString(36).slice(2);document.write('<div id=\''+s+'\'></div>');(window.slotbybcs=window.slotbybcs || []).push({key:'" + id + "',div:s});})();</script><script type='text/javascript' src='https://sra.toutiaobashi.com:443/static/selling.js'></script>"
  var url = 'https://sra.toutiaobashi.com:443/ps/std?key=' + id
  if (type === 'url') {
    return url
  } else if (type === 'code') {
    return code
  }
  return '格式错误'
}

/* global beetils moment BTZ */ // Shuts ESLint up
// -----------------------------------------------------------------------------

// Eval but just return null if syntax error. 
// Obviously don't use serverside with user-supplied input.
function laxeval(s) {
  try { 
    var x = eval(s)
    return typeof x === 'undefined' ? null : x
  } catch(e) { return null } 
}

// Turn a Date object (default now) to unixtime in seconds
function unixtm(d=null) {
  if (d===null) { d = new Date() }
  return d.getTime()/1000
}

// Take a Date object, set the time back to midnight, return new Date object
function dayfloor(d) {
  var x = new Date(d)
  x.setHours(0)
  x.setMinutes(0)
  x.setSeconds(0)
  return x
}

// Turn a unixtime in seconds into a "YYYY-MM-DD HH:MM:SS (TZ)" string. Or if
// shtz is false then don't show the timezone.
function shd(t, tz=null, shtz=false) {
  tz = tz === null ? BTZ : tz
  return moment(t*1000).tz(tz).format('YYYY-MM-DD HH:mm:ss ddd')
         + (shtz ? ' ' + beetils.tzDescribe(tz, t) : '')
}

// Turn a string like "2h30m" or "2:30" into a number of seconds.
// Also accepts arithmetical expressions like :45*2 (= 1.5h).
// WARNING: It does that with an eval so this is for clientside code only.
function parseHMS(s) {
  s = s.replace(/(\d*)\:(\d+)\:(\d+)/g, '($1+$2/60+$3/3600)') // "H:M:S"
  s = s.replace(/(\d*)\:(\d+)/g,        '($1+$2/60)') // "H:M" -> "(H+M/60)"
  s = s.replace(/:/, '') // get rid of further colons; i forget why
  s = s.replace(/\s/g, '') // nix whitespace eg "4h 5m" -> "4h5m"
  s = s.replace(/((?:[\d\.]+[dhms])+)/g, '($1)') // put parens around eg "4h5m"
  s = s.replace(/([\d\.\)])\s*([dhms])/g, '$1*$2') // eg "1h" -> "1*h"
  s = s.replace(/([dhms])\s*([\d\.\(])/g, '$1+$2') // eg "3h2m" -> "3h+2m"
  s = s.replace(/[dhms]/g, m=>({d:'24 ', h:'1 ', m:'1/60 ', s:'1/3600 '}[m]))
  const x = laxeval(s)
  return x===null ? NaN : 3600*x
} 

// Parse a YMDHMS date, return unixtime in seconds.
function parsedate(s, tz=null) { 
  tz = tz === null ? BTZ : tz
  //console.log(`parsing [${s}][${tz}]`)
  if (/^\s*\d{9,10}\s*$/ .test(s)) return +s
  if (/^\s*\d{12,13}\s*$/.test(s)) return +s/1000
  return moment.tz(s, tz).unix() 
}

/******************************************************************************
 *                      STUFF WE'RE NOT CURRENTLY USING                       *
 ******************************************************************************/

// Return the time-of-day right now, as a number of seconds after midnight
/*
function now() {
  var d = new Date()
  return 3600*d.getHours() + 60*d.getMinutes() + d.getSeconds()
}
*/

/* global beetils moment shd */ // Shuts ESLint up
// -----------------------------------------------------------------------------

window.beetils = {}

/******************************************************************************
 *                                                                            *
 *                             BEGIN PUMPKINTIME                              *
 *                                                                            *
 *       WARNING: MASTER COPY AT https://glitch.com/edit/#!/pumpkintime       *
 *                                                                            *
 *                                                                            *
 ******************************************************************************/

/******************************************************************************
 *               HELPER FUNCTIONS FOR DOOMSTRING / PUMPKINTIME                *
 ******************************************************************************/

// Convenience function. What Jquery's isNumeric does, I guess. Javascript wat?
beetils.isnum = function(x) { return x - parseFloat(x) + 1 >= 0 }

// Take a timezone string like "Europe/Rome" and return the standard
// abbreviation for it like "CEST" if there is one, otherwise return the city
// part of the timezone string -- the part after the last slash, and with the
// underscores replaced with spaces. Timezone abbreviations typically depend on
// the timestamp, due to daylight savings time, so we can optionally pass in a 
// timestamp, defaulting to now (whenever the function is called).
beetils.tzAbbr = function(tz, t) {
  t = t === undefined ? null : t // should be default param
  t = t === null ? Date.now()/1000 : t
  var d = moment.tz(t*1000, tz) // should be const
  if (moment.tz.zone(tz) === null) return "UNKNOWN_TIMEZONE" // never(?) happens
  var s = d.format('z')        // z for zone; abbreviation or offset // should be const
  if (/^[a-z]+$/i.test(s)) return s // the friendly alphabetic-only abbreviation
  return tz.replace(/^.*\//, '').replace(/_/g, ' ')    // the city (with spaces)
}

// Take a timezone string like "Asia/Tokyo" and return a string like "UTC+09"
beetils.tzOffset = function(tz, t) {
  t = t === undefined ? null : t // should be default param
  t = t === null ? Date.now()/1000 : t
  var zone = moment.tz.zone(tz) // should be const
  if (zone === null) return "UNKNOWN_TIMEZONE"
  var hoffset = -zone.utcOffset(t*1000)/60 // should be const
  return 'UTC' + (hoffset >= 0 ? '+' : '') + hoffset
}

// Take a timezone string like "America/Los_Angeles" and a timestamp (default
// now) and a boolean saying whether we want the full string with UTC offset 
// like "(UTC+3)" and return a human-friendly string describing the timezone 
// like "PDT" (if full=false) or "PDT (UTC-7)" (if full=true).
beetils.tzDescribe = function(tz, t, full) {
  t = t === undefined ? null : t
  full = full === undefined ? true : full // should be default params
  if (moment.tz.zone(tz) === null) return "UNKNOWN_TIMEZONE"
  return beetils.tzAbbr(tz, t) + 
         (full ? ' (' + beetils.tzOffset(tz, t) + ')' : '')
}

// Convert a number of seconds to a human-friendly string showing days, hours,
// minutes, seconds. Like 65 -> "1m 5s" or 3600 -> "1h". There's a granularity 
// parameter if you want to, say, drop the seconds when the amount of time is
// more than a minute (set gran=60 in that case). So 65 seconds would be
// formated as just "1m" and even 119s -> "1m" even though that's 1 second shy
// of 2 minutes. NOTE: Granularity less than 1, for fractional seconds, is not 
// very well supported (needs normberlize and stuff) but we're not using
// sub-second granularity in Beeminder so that's fine for now.
// NOTE: This currently doesn't omit, eg, minutes when minutes are 0. That's 
// maybe better when doing a live countdown so the numbers don't visually 
// jump around so much. So we show 1h as "1h 0m 0s"
beetils.genHMS = function(t, gran) { // granularity: drop number of secs less than that
  gran = gran === undefined ? 1 : gran  // should be default param
  if (!beetils.isnum(t)) return 'NaNs'
  // unicode 8722 is a proper minus sign, 8239 is narrow no-break space, 1/12 em
  if (t<0) return String.fromCharCode(8722) + 
                  String.fromCharCode(8239) + beetils.genHMS(-t, gran)
  t = t < gran || gran === 0 ? t : Math.floor(t/gran)*gran
  var a = [] // array of stringy bits like ["1d", "2h", "3m", "4s"]
  var d = Math.floor(t/86400); t %= 86400
  var h = Math.floor(t/3600);  t %= 3600  // these should be let not var
  var m = Math.floor(t/60);    t %= 60
  if (d>0)               a.push(d+'d')
  if (d>0 || h>0)        a.push(h+'h')
  if (d>0 || h>0 || m>0) a.push(m+'m')
  if (d<2)               a.push(t+'s')
  //   32: a normal space is typically 1/4 of an em wide
  // 8287: mathematical space, 4/18 em, barely narrower than normal space
  // 8201: thin space, 1/5 or 1/6 of an em wide, depending on the font
  // 8198: six-per-em, ie, 1/6 em wide
  // 8239: narrow no-break, 1/3 of a normal space = 1/12 em, probably too narrow
  return a.join(String.fromCharCode(8198))
}

// TODO: genHMS should return plain ascii and we should have a gussy() function
// at the display level that thins the spaces, replaces the dash with a minus
// sign followed by a narrow no-break space, and makes the whole thing red if
// if it's negative. Then we don't have to worry about any of that in the 
// qual suite.

//beetils.gussyHMS = function(s) {
//
//}

// Take a number of seconds after midnight, return a time-of-day string like
// "3pm". And syes false means ignore seconds.
beetils.genTOD = function(t, ampm, syes) {
  ampm = ampm === undefined ? true : ampm
  syes = syes === undefined ? false : syes // should be default params
  if (!beetils.isnum(t))   { return "NaN'o'clock" }
  if (t < 0 || t >= 86400) { return '??:??' } // or should we just mod by 86400?
  
  var h = Math.floor(t/3600)   // should be let
  var m = Math.floor(t%3600/60)   // should be let
  var s = syes ? Math.floor(t%60) : 0   // should be let
  if (s>59) { s -= 60; m += 1 }
  if (m>59) { m -= 60; h += 1 }

  var suf = '' // suffix, "am" or "pm" or nothing  // should be let
  if (ampm) {
    if      (h===0 || h===24) { suf = 'am'; h = 12  }
    else if (h===12)          { suf = 'pm'          }
    else if (h>=13 && h<=23)  { suf = 'pm'; h -= 12 }
    else                      { suf = 'am'          }
  }
  //let out = `${h}:${m<10 ? '0'+m : m}:${s<10 ? '0'+s : s}${suf}` // ES6
  var out = '' + h + ':' + (m<10 ? '0'+m : m) + ':' + (s<10 ? '0'+s : s) + suf  // should be var
  out = out.replace(/:00(?::00)?([ap]m)$/, '$1') // eg 3:00am -> 3am
  out = out.replace(/(:\d\d):00$/, '$1') // eg 3:21:00 -> 3:21
  return out
}

// Take as-of/current time and deadline time (unixtimes in seconds) and return 
// the relative deadline like "8h 4m 2s".
beetils.doomTill = function(ao, dl) {
  ao = ao === null ? Date.now()/1000 : ao
  //dl += 1 // countdown kludge cuz reasons 
  //return beetils.genHMS(dl-ao)
  var td = Math.floor(dl-ao) // time (in seconds) till deadline  // should be const
  var days = Math.floor(td/86400)  // should be const
  if (td < 0) { return "Time's up!" } 
  else {
    //return beetils.genHMS(td)
    if      (days > (365*3)) { return parseInt(days/365) + " years" }
    else if (days > 90)      { return parseInt(days/30) + " months" }
    else if (days > 10)      { return days + " days" }
    else {
      var daysString = days === 0 ? "" : days + "d " // should be let
      if (days === 0) { daysString = "" }
      var hours = parseInt(td/3600) % 24 // should be const
      var minutes = parseInt(td/  60) % 60 // should be let
      if (minutes < 10) { minutes = "0" + minutes }
      var seconds = td % 60 // should be let
      if (seconds < 10) { seconds = "0" + seconds }
      return daysString + hours + "h " + minutes + "m" +
        (days < 2 ? " " + seconds + "s" : "")
    }
  }
}

// -----------------------------------------------------------------------------
// Take as-of/current time and deadline time (unixtimes in seconds) and return
// the absolute deadline like "12am tonight". If showtz is true then includ the
// timezone explicitly in the output, like "12am PST tonight". Finally, the 
// timezone can be given explicitly. The default is the browser's timezone.
// This is different than an off-the-shelf format-date-time function in that it
// treats post-midnight times like 1am on what's technically Saturday as Friday
// night, or like "3am tonight" if it's after the upcoming midnight. If it's
// already after midnight and so is the deadline -- like it's 1am and the
// deadline is 2am -- then it says "2am today".
beetils.doomWhen = function(ao, dl, showtz, tz) {
  showtz = showtz === undefined ? false : showtz
  tz = tz === undefined ? null : tz // should be default params
  ao = ao === null ? Date.now()/1000 : ao
  tz = tz === null ? moment.tz.guess() : tz
  //dl += 1 // countdown kludge cuz reasons
  var diff = dl-ao  // should be const
  var days = Math.floor(diff/86400)  // should be const
  var mao = moment.tz(ao*1000, tz) // moment date object for as-of  // should be const
  var mdl = moment.tz(dl*1000, tz) // moment date object for deadline  // should be const

  var hrfmt = 'h:mma' // should be const
  var tzstr = showtz ? " (" + beetils.tzAbbr(tz, dl) + ")" : "" // should be let
  if (diff < 0) { return "Time's up!" }
  if (days < 1) {
    //console.log(`${shd(ao, tz, true)} -> ${shd(dl, tz, true)} -- ` + 
    //            `mdl.hours() = ${mdl.hours()}; mao.hours() = ${mao.hours()}`)
    var prefix = mdl.hours() <= 6          ? "tonight"  :  // should be const
                   mdl.hours() < mao.hours() ? "tomorrow" : 
                                               "today"                
    return prefix + mdl.format(", " + hrfmt) + tzstr
  }
  if (days < 7) {
    if (mdl.hours() <= 6) {
      // night owl goal, so subtract a day to have it formatted correctly
      mdl.subtract(1, 'days')
      return mdl.format("ddd") + " night, " + mdl.format(hrfmt) + tzstr
    }
    return mdl.format("ddd, "+hrfmt) + tzstr
  }
  if (days < 365) return mdl.format("D MMM")
  return mdl.format("MMM Y")
}

// We don't actually want to say "safe until" or "safe for" for do-less goals.
// The only thing you care about for those is today's hard cap.
// We don't actually want to say "safe until" or "safe for" for do-less goals.
// The only thing you care about for those is today's hard cap.
beetils.doomModifier = function(slug, limiter, coasting) {
  var cal = (beetils.doomFormat(slug) === "calendar");

  if (coasting) {        if (cal) { return "ending on "  } // don't want "on"
                         else     { return "ending in "  }
  } else if (limiter) {  if (cal) { return "safe until " }
                         else     { return "safe for "   }
  } else {               if (cal) { return "due "        }
                         else     { return "due in "     }
  }
}

/* Refactoring like so may make sense:
beetils.doomModifier = function(doomFormat, limiter, coasting) {
  var cal = (doomFormat === "calendar");

  if (coasting) {        if (cal) { return "ending on "  } // don't want "on"
                         else     { return "ending in "  }
  } else if (limiter) {  if (cal) { return "safe until " }
                         else     { return "safe for "   }
  } else {               if (cal) { return "due "        }
                         else     { return "due in "     }
  }
}
*/

// Take the derailment time (unixtime in seconds) and a format choice (either 
// "calendar" or "countdown") and the user's Beeminder timezone and return a 
// string saying when you'll derail. 
// We've also added optional parameters for testing: the unixtime of "now" (aka 
// "as of") and the browser's timezone. If those aren't given then now is now 
// and the browser's timezone is the browser's timezone. Timezones are like 
// "America/Los_Angeles". The format ("countdown" or "calendar") is stored and 
// retrieved from the browser's local storage so it's sticky for the user. 
// See beetils.doomFormat(slug).
// NOTE: The stored user timezone, utz, is not used except to compare to the
// browser timezone. If it's different then we show the browser timezone 
// explicitly in the output, otherwise we don't. Bit of an anti-magic violation!
beetils.doomString = function(doom, fmt, utz, asof, brotz) {
  asof = asof === undefined ? null : asof 
  brotz = brotz === undefined ? null : brotz // should be default params
  brotz = brotz === null ? moment.tz.guess() : brotz
  if (fmt==="countdown") return beetils.doomTill(asof, doom)
  if (fmt==="calendar")  return beetils.doomWhen(asof, doom, utz!==brotz, brotz)
  return "ERROR_0304" // passed in bad format string; should never happen
}

/******************************************************************************
 *                                                                            *
 *                              END PUMPKINTIME                               *
 *                                                                            *
 ******************************************************************************/


/******************************************************************************
 *                      STUFF WE'RE NOT CURRENTLY USING                       *
 ******************************************************************************/

beetils.doomStringORIG = function(doomStamp, format, utz, nowStamp=null, browsertz=null) {
  var now = nowStamp === null ? moment() : moment.unix(nowStamp)
  if (browsertz === null) browsertz = moment.tz.guess()
    
  // doomDate is the timestamp in browser's local time
  var doomDate = moment.tz((doomStamp + 1)*1000, browsertz)
  var diff = doomDate.unix() - now.unix()
  var days = Math.floor(diff/(24*60*60))

  if (format === "calendar") {
    var hrfmt = 'h:mma'
    var tzstr = ''
    // if the user timezone doesn't match the browser's timezone, 
    // then we should append tz description to the end to clarify
    // that we are showing deadline time in the browser timezone
    if (utz !== browsertz) {
      if (doomDate.format('z').match(/^[A-Z]+$/)) {
        // check if the timezone has a friendly abbreviation
        tzstr = doomDate.format(' (z)')
      } else {
        // ow: use the city portion of the tz string
        tzstr = " (" + browsertz.replace(/^.*\//, '')
          .replace(/_/g, ' ') + ")"
      }
    }
    if (diff < 0) {
      return "Time's up!"
    }
    else if (days < 1) {
      var prefix
      if      (doomDate.hours() <= 6)           { prefix = "tonight"  }
      else if (now.hours() >= doomDate.hours()) { prefix = "tomorrow" }
      else                                      { prefix = "today"    }
      return prefix + doomDate.format(", "+hrfmt) + tzstr
    }
    else if (days < 7) {
      if (doomDate.hours() <= 6) {
        // night owl goal, so subtract a day to have it formatted correctly
        doomDate.subtract(1, 'days')
        return doomDate.format("ddd") + " night, " + doomDate.format(hrfmt) + tzstr
      }
      return doomDate.format("ddd, "+hrfmt) + tzstr
    }
    else if (days < 365) { return doomDate.format("D MMM") }
    else                 { return doomDate.format("MMM Y") }
  }
  else if (format === "countdown") {
    if (diff < 0) {
      return "Time's up!"
    } else {
      if      (days > (365*3)) { return parseInt(days/365) + " years" }
      else if (days > 90)      { return parseInt(days/30) + " months" }
      else if (days > 10)      { return days + " days" }
      else {
        var daysString = (days === 0 ? "" : days + "d ")
        if (days === 0) { daysString = "" }
        var hours = parseInt( diff / 3600 ) % 24
        var minutes = parseInt( diff / 60 ) % 60
        if (minutes < 10) { minutes = "0" + minutes }
        var seconds = diff % 60
        if (seconds < 10) { seconds = "0" + seconds }
        return daysString + hours + "h " + minutes + "m" +
          (days < 2 ? " " + seconds + "s" : "")
      }
    }
  }
}
// -----------------------------------------------------------------------------

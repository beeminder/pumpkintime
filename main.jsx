/* global moment */ // Shut ESLint up about "moment not defined"
// -----------------------------------------------------------------------------

// Each row in the qual suite has the following fields:
// 1. As-of: unixtime (in seconds) of whatever "now" is for the user
// 2. Deadline: unixtime of the time/deadline we're telling the user about
// 3. Timezone: standard tzstring, e.g., "America/Los_Angeles"
// 4. Relative: the string to show the user if they care about the relative time
// 5. Absolute: the string to show the user if they care about the absolute time
// 6. Absolute with timezone: same but with timezone shown explicitly
// -----------------------------------------------------------------------------
const UTC = "UTC"
const PST = "America/Los_Angeles"
const EST = "America/New_York"
const MEL = "Australia/Melbourne"
const GUA = "Pacific/Guam" // Abbreviation = "ChST" (note the camelCase)
const LON = "Europe/London"
const suite = [
// consider saying "midnight" and "noon" instead of "12am" and "12pm"
[1600000000, 1700000000, "America/Chicago", "3 years", "Nov 2023", "Nov 2023"],
[1234567890, 1234567890, UTC, "0h 00m 00s", "today, 11:31pm", "today, 11:31pm (UTC)"],
[1234567890, 1234567891, UTC, "0h 00m 01s", "today, 11:31pm", "today, 11:31pm (UTC)"],
[1586196000, 1586197799, PST, "0h 29m 59s", "today, 11:29am", "today, 11:29am (PDT)"],
[1600000000, 1599999999, PST, "Time's up!", "Time's up!", "Time's up!"],
[1600000000, 1599999998, PST, "Time's up!", "Time's up!", "Time's up!"],
[1586221200, 1586222999, MEL, "0h 29m 59s", "today, 11:29am", "today, 11:29am (AEST)"],
[1586196000, 1586199599, PST, "0h 59m 59s", "today, 11:59am", "today, 11:59am (PDT)"],
[1586196000, 1586199600, PST, "1h 00m 00s", "today, 12:00pm", "today, 12:00pm (PDT)"],
[1586221200, 1586224799, MEL, "0h 59m 59s", "today, 11:59am", "today, 11:59am (AEST)"],
[1586196000, 1586228399, PST, "8h 59m 59s", "today, 7:59pm", "today, 7:59pm (PDT)"],
[1586221200, 1586226599, MEL, "1h 29m 59s", "today, 12:29pm", "today, 12:29pm (AEST)"],
[1586264400, 1586310899, MEL, "12h 54m 59s", "tomorrow, 11:54am", "tomorrow, 11:54am (AEST)"],
[1586326920, 1586327399, PST, "0h 07m 59s", "today, 11:29pm", "today, 11:29pm (PDT)"],
[1604820120, 1604820599, PST, "0h 07m 59s", "today, 11:29pm", "today, 11:29pm (PST)"],
[1601965320, 1601965800, PST, "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (PDT)"],
[1586224800, 1586310899, MEL, "23h 54m 59s", "tomorrow, 11:54am", "tomorrow, 11:54am (AEST)"],
[1586210400, 1586267999, MEL, "15h 59m 59s", "today, 11:59pm", "today, 11:59pm (AEST)"],
[1586210400, 1586268000, MEL, "16h 00m 00s", "tonight, 12:00am", "tonight, 12:00am (AEST)"],
[1586210400, 1586269799, MEL, "16h 29m 59s", "tonight, 12:29am", "tonight, 12:29am (AEST)"],
[1586228400, 1586527199, MEL, "3d 10h 59m", "Fri, 11:59pm", "Fri, 11:59pm (AEST)"],
[1586228400, 1586527200, MEL, "3d 11h 00m", "Fri night, 12:00am", "Fri night, 12:00am (AEST)"],
[1586291920, 1586329200, PST, "10h 21m 20s", "tonight, 12:00am", "tonight, 12:00am (PDT)"],
[1604820120, 1604827799, PST, "2h 07m 59s", "tonight, 1:29am", "tonight, 1:29am (PST)"],
[1604823720, 1604827799, PST, "1h 07m 59s", "tonight, 1:29am", "tonight, 1:29am (PST)"],
[1604827320, 1604827799, PST, "0h 07m 59s", "tonight, 1:29am", "tonight, 1:29am (PST)"],
[1601128801, 1601190000, GUA, "16h 59m 59s", "today, 5:00pm", "today, 5:00pm (ChST)"],
[1601143200, 1601146800, PST, "1h 00m 00s", "today, 12:00pm", "today, 12:00pm (PDT)"],
[1601199001, 1601210046, PST, "3h 04m 05s", "tonight, 5:34am", "tonight, 5:34am (PDT)"],
[1601239559, 1601276401, PST, "10h 14m 02s", "tonight, 12:00am", "tonight, 12:00am (PDT)"],
[1601253959, 1601253960, PST, "0h 00m 01s", "today, 5:46pm", "today, 5:46pm (PDT)"],
[1601411880, 1601683200, PST, "3d 3h 22m", "Fri, 5:00pm", "Fri, 5:00pm (PDT)"],
[1601240357.147, 1601276400, PST, "10h 00m 42s", "tonight, 12:00am", "tonight, 12:00am (PDT)"],
[1601191320, 1601195400, PST, "1h 08m 00s", "tonight, 1:30am", "tonight, 1:30am (PDT)"],
[1601194921, 1601195400, PST, "0h 07m 59s", "tonight, 1:30am", "tonight, 1:30am (PDT)"],
[1601244000, 1601247600, PST, "1h 00m 00s", "today, 4:00pm", "today, 4:00pm (PDT)"],
[1601258460, 1601265600, PST, "1h 59m 00s", "today, 9:00pm", "today, 9:00pm (PDT)"],
[1601208000, 1601294400, PST, "1d 0h 00m 00s", "Sun night, 5:00am", "Sun night, 5:00am (PDT)"],
[1601241134.167, 1601305200, PST, "17h 47m 45s", "tomorrow, 8:00am", "tomorrow, 8:00am (PDT)"],
[1601241150.168, 1601316000, PST, "20h 47m 29s", "tomorrow, 11:00am", "tomorrow, 11:00am (PDT)"],
[1601241162.167, 1601319600, PST, "21h 47m 17s", "tomorrow, 12:00pm", "tomorrow, 12:00pm (PDT)"],
[1601241176.166, 1601337600, PST, "1d 2h 47m 03s", "Mon, 5:00pm", "Mon, 5:00pm (PDT)"],
[1601241209.164, 1601362799, PST, "1d 9h 46m 29s", "Mon, 11:59pm", "Mon, 11:59pm (PDT)"],
[1601241209.164, 1601362800, PST, "1d 9h 46m 30s", "Mon night, 12:00am", "Mon night, 12:00am (PDT)"],
[1601287200, 1601460000, PST, "2d 0h 00m", "Tue night, 3:00am", "Tue night, 3:00am (PDT)"],
[1601316000, 1601319300, PST, "0h 55m 00s", "today, 11:55am", "today, 11:55am (PDT)"],
[1601274120.173, 1601274600.054, PST, "0h 07m 59s", "today, 11:30pm", "today, 11:30pm (PDT)"],
[1601251200.852, 1601254440.587, PST, "0h 53m 59s", "today, 5:54pm", "today, 5:54pm (PDT)"],
[1601251200.61, 1601256120.787, PST, "1h 22m 00s", "today, 6:22pm", "today, 6:22pm (PDT)"],
[1601241523, 1601260090, PST, "5h 09m 27s", "today, 7:28pm", "today, 7:28pm (PDT)"],
[1601241538, 1601251200.912, PST, "2h 41m 02s", "today, 5:00pm", "today, 5:00pm (PDT)"],
[1234567890, 1586449399, PST, "11 years", "Apr 2020", "Apr 2020"],
[1586450262, 1586451300, "Asia/Irkutsk", "0h 17m 18s", "tonight, 12:55am", "tonight, 12:55am (Irkutsk)"],
[1586450262, 1586451300, PST, "0h 17m 18s", "today, 9:55am", "today, 9:55am (PDT)"],
[1601244796, 1601276400, LON, "8h 46m 44s", "tomorrow, 8:00am", "tomorrow, 8:00am (BST)"],
[1601895603, 1601902803, LON, "2h 00m 00s", "today, 2:00pm", "today, 2:00pm (BST)"],
[1593792000, 1593788400, "Australia/Perth", "Time's up!", "Time's up!", "Time's up!"],
[1601881791, 1601967601, PST, "23h 50m 10s", "tonight, 12:00am", "tonight, 12:00am (PDT)"],
[1601856720, 1601967600, "Africa/Abidjan", "1d 6h 48m 00s", "Tue, 7:00am", "Tue, 7:00am (GMT)"],
[1583211600, 1583283600, "Africa/Cairo", "20h 00m 00s", "tonight, 3:00am", "tonight, 3:00am (EET)"],
[1590904800, 1590987600, "Africa/Casablanca", "23h 00m 00s", "tonight, 6:00am", "tonight, 6:00am (Casablanca)"],
[1623056400, 1623099600, "Africa/Djibouti", "12h 00m 00s", "tonight, 12:00am", "tonight, 12:00am (EAT)"],
[1661979600, 1661986800, "Africa/Johannesburg", "2h 00m 00s", "tonight, 1:00am", "tonight, 1:00am (SAST)"],
[1739599200, 1740042000, "America/North_Dakota/New_Salem", "5d 3h 00m", "Wed night, 3:00am", "Wed night, 3:00am (CST)"],
[1893423600, 2208956400, "Asia/Tokyo", "10 years", "Jan 2040", "Jan 2040"],
[1583173800, 1617561000, "Asia/Kolkata", "13 months", "Apr 2021", "Apr 2021"],
[1601492400, 1602014400, "Indian/Maldives", "6d 1h 00m", "Tue night, 1:00am", "Tue night, 1:00am (Maldives)"],
[1265151600, 1265756400, "Europe/Budapest", "7d 0h 00m", "10 Feb", "10 Feb"],
[1577836800, 1579057200, "Atlantic/Reykjavik", "14 days", "15 Jan", "15 Jan"],
[1427878800, 1430467200, "America/Anchorage", "29 days", "1 May", "1 May"],
[946695600, 949373998, "America/Argentina/Buenos_Aires", "30 days", "31 Jan", "31 Jan"],
[946827000, 978319800, "America/St_Johns", "12 months", "1 Jan", "1 Jan"],
[1746432000, 1812313800, "Pacific/Pitcairn", "25 months", "Jun 2027", "Jun 2027"],
[1609347600, 1704042000, "Asia/Phnom_Penh", "3 years", "Jan 2024", "Jan 2024"],
[31536000, 2114380800, "Antarctica/Troll", "66 years", "Jan 2037", "Jan 2037"],
[1550430000, 1550512740, LON, "22h 59m 00s", "tomorrow, 5:59pm", "tomorrow, 5:59pm (GMT)"],
[1601965320, 1601965800, PST, "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (PDT)"],
[1601965320, 1601965800, "America/Santa_Isabel", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (PDT)"],
[1601961720, 1601962200, "America/Denver", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (MDT)"],
[1601958120, 1601958600, "US/Central", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (CDT)"],
[1601954520, 1601955000, "US/Michigan", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (EDT)"],
[1601961720, 1601962200, "Pacific/Galapagos", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Galapagos)"],
[1601954520, 1601955000, "America/Toronto", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (EDT)"],
[1601950920, 1601951400, "Atlantic/Bermuda", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (ADT)"],
[1601950920, 1601951400, "America/Sao_Paulo", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Sao Paulo)"],
[1601947320, 1601947800, "Atlantic/South_Georgia", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (South Georgia)"],
[1601943720, 1601944200, "Atlantic/Cape_Verde", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Cape Verde)"],
[1601940120, 1601940600, "Atlantic/Azores", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Azores)"],
[1601889720, 1601890200, "Pacific/Kiritimati", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Kiritimati)"],
[1601976120, 1601976600, "Pacific/Apia", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Apia)"],
[1601983320, 1601983800, "Pacific/Fiji", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Fiji)"],
[1601983320, 1601983800, "Pacific/Norfolk", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Norfolk)"],
[1601986920, 1601987400, "Australia/Lord_Howe", "0h 08m 00s", "today, 11:30pm", "today, 11:30pm (Lord Howe)"],
[1601904120, 1601991000, "Australia/Brisbane", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (AEST)"],
[1601907720, 1601994600, "Asia/Tokyo", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (JST)"],
[1601908620, 1601995500, "Australia/Eucla", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (Eucla)"],
[1601911320, 1601998200, "Australia/Perth", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (AWST)"],
[1601911320, 1601998200, "Asia/Taipei", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (CST)"],
[1601914920, 1602001800, "Asia/Jakarta", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (WIB)"],
[1601916720, 1602003600, "Indian/Cocos", "1d 0h 08m 00s", "Tue, 11:30pm", "Tue, 11:30pm (Cocos)"],
[1601918520, 1602178620, "Asia/Urumqi", "3d 0h 15m", "Thu, 11:37pm", "Thu, 11:37pm (Urumqi)"],
[1601919420, 1570557120, "Asia/Kathmandu", "Time's up!", "Time's up!", "Time's up!"],
[1601920320, 1633716420, "Asia/Kolkata", "12 months", "Oct 2021", "Oct 2021"],
[1601922120, 1602268620, "Indian/Maldives", "4d 0h 15m", "Fri, 11:37pm", "Fri, 11:37pm (Maldives)"],
[1601923920, 1602320820, "Asia/Kabul", "4d 14h 15m", "Sat, 1:37pm", "Sat, 1:37pm (Kabul)"],
[1601925720, 1602409020, "Asia/Dubai", "5d 14h 15m", "Sun, 1:37pm", "Sun, 1:37pm (Dubai)"],
[1601866320, 1602500820, "Asia/Tehran", "7d 8h 15m", "12 Oct", "12 Oct"],
[1601868120, 1602589020, "Europe/Moscow", "8d 8h 15m", "13 Oct", "13 Oct"],
[1601868120, 1602675420, "Europe/Kiev", "9d 8h 15m", "14 Oct", "14 Oct"],
[1601868120, 1602761820, "Asia/Jerusalem", "10d 8h 15m", "15 Oct", "15 Oct"],
[1601871720, 1602851820, "Africa/Tripoli", "11 days", "16 Oct", "16 Oct"],
[1601871720, 1602938220, "Europe/Rome", "12 days", "17 Oct", "17 Oct"],
[1601914920, 1603067820, "Pacific/Honolulu", "13 days", "18 Oct", "18 Oct"],
[1601907720, 1603147020, "America/Juneau", "14 days", "19 Oct", "19 Oct"],
[183026760, 372371400, "Pacific/Pitcairn", "6 years", "Oct 1981", "Oct 1981"],
[183010560, 372333600, "US/Michigan", "6 years", "Oct 1981", "Oct 1981"],
[1179217680, 1233750420, EST, "21 months", "Feb 2009", "Feb 2009"],
[1602047871, 1602054001, PST, "1h 42m 10s", "tonight, 12:00am", "tonight, 12:00am (PDT)"],
[1602047965, 1602048025, PST, "0h 01m 00s", "today, 10:20pm", "today, 10:20pm (PDT)"],
[1602048214, 1602051814, PST, "1h 00m 00s", "today, 11:23pm", "today, 11:23pm (PDT)"],
[1602048239, 1602055439, PST, "2h 00m 00s", "tonight, 12:23am", "tonight, 12:23am (PDT)"],
[1602095168, 1602113468, PST, "5h 05m 00s", "today, 4:31pm", "today, 4:31pm (PDT)"],
[1602095280, 1602131280, PST, "10h 00m 00s", "today, 9:28pm", "today, 9:28pm (PDT)"],
[1602085200, 1602129120, EST, "12h 12m 00s", "today, 11:52pm", "today, 11:52pm (EDT)"],
[1602106502, 1602279300, EST, "1d 23h 59m 58s", "Fri, 5:35pm", "Fri, 5:35pm (EDT)"],
[1602106680, 1602279540, PST, "2d 0h 01m", "Fri, 2:39pm", "Fri, 2:39pm (PDT)"],
[1602106709.662, 1599514709.662, PST, "Time's up!", "Time's up!", "Time's up!"],
[1602106716.741, 1604698716.741, PST, "30 days", "6 Nov", "6 Nov"],
[1602106753, 1633642753, PST, "12 months", "Oct 2021", "Oct 2021"],
[1602106796, 1665178796, PST, "24 months", "Oct 2022", "Oct 2022"],
[1602106813, 1649410813, PST, "18 months", "Apr 2022", "Apr 2022"],
[1602106843, 1917466843, PST, "10 years", "Oct 2030", "Oct 2030"],
[1602106870, 1696714870, PST, "36 months", "Oct 2023", "Oct 2023"],
[1602106903, 1712482903, PST, "3 years", "Apr 2024", "Apr 2024"],
[1602106941, 1699868541, PST, "3 years", "Nov 2023", "Nov 2023"],
[1602106961, 1725097361, PST, "3 years", "Aug 2024", "Aug 2024"],
[1602106989.5, 1728250989.5, PST, "4 years", "Oct 2024", "Oct 2024"],
[1602107008, 1731404608, PST, "4 years", "Nov 2024", "Nov 2024"],
[1602107030, 2232827030, PST, "20 years", "Oct 2040", "Oct 2040"],
[1602107059, 2548187059, PST, "30 years", "Sep 2050", "Sep 2050"],
[1602107082, 3178907082, PST, "50 years", "Sep 2070", "Sep 2070"],
[1602107103, 4755707103, PST, "100 years", "Sep 2120", "Sep 2120"],
[1602107130, 33138107130, PST, "1000 years", "Feb 3020", "Feb 3020"],
[1602197986.5, 1603432968.5, PST, "14 days", "22 Oct", "22 Oct"],
[1602234298, 1640073600, PST, "14 months", "Dec 2021", "Dec 2021"],

]
// -----------------------------------------------------------------------------


/******************************************************************************
 *                             CONSTANTS & GLOBALS                            *
 ******************************************************************************/

let TID = null     // Timer ID for interval timer, for refreshing every second
const GRAY = "#999999"
const BTZ = Intl.DateTimeFormat().resolvedOptions().timeZone // browser timezone

/******************************************************************************
 *                             REACT-IVE WEBSITE                              *
 ******************************************************************************/

// In the qual suite we use constants like PST so we can just type "PST" 
// instead of "\"America/Los_Angeles\"". Here we do those substitutions.
function constify(z) {
  return z === UTC ? 'UTC' :
         z === PST ? 'PST' :
         z === EST ? 'EST' :
         z === MEL ? 'MEL' :
         z === GUA ? 'GUA' : 
         z === LON ? 'LON' : `"${z}"`
}

// Given the asof time, return the string that comes after the "current time" 
// field in the UI.
function shas(x) { // "shas" = "show as-of / current-time" (pronounced SHAZ)
  //console.log(`${x}`)
  const d = new Date(x*1000)
  return d.toLocaleString('en-US', { timeZoneName:"long" })
}

// Given deadline and time to deadline, return the string that comes after the
// deadline field in the UI. "time-of-day (+countdown)".
function shead(dl, td) { // "shead" = "show deadline" (pronounced SHED)
  if (dl<0 && td<0 || !isnum(dl) || !isnum(td)) { return '??:?? (+??h)' }
  if (dl<0) { dl = teatime(td) }
  if (td<0) { td = pumpkin(dl) }
  return `${genTOD(dl)} (+${beetils.genHMS(td)})`
}

function shpa(ao, dl) { // "shpa" = "show pumpkin absolute" (pronounced SHPAH)
  const tz = moment.tz.guess()
  //console.log(`ao=${ao} dl=${dl} tz=${tz} ${doomString(dl, "calendar", tz, ao, tz)}`)
  return doomString(dl, "calendar", tz, ao, tz)
}

function shpr(ao, dl) { // "shpr" = "show pumpkin relative" (pronounced SHPER)
  const tz = moment.tz.guess()
  //console.log(`ao=${ao} dl=${dl} tz=${tz} ${doomString(dl, "calendar", tz, ao, tz)}`)
  return doomString(dl, "countdown",  tz, ao, tz)
}

// not DRY with chgA yet cuz of the "nw" state field
function parseao(v, tz) {
  if (/^\s*(?:now)?\s*$/i.test(v)) { // as-of is "now" or blank
    return unixtm()
  } else {
    return parsedate(v, tz)
  }
}

function parsedl(v, tz) {
  let td, dl
  if (/^[\+\-]/.test(v)) {    // starts w/ "+" or "-" so deadline is relative
    td = parseHMS(v)
    dl = -1
  } else {                    // a fixed deadline time
    if (/^\s*$/.test(v)) { 
      dl = unixtm(dayfloor(new Date())) + 86400
    } else {
      dl = parsedate(v, tz)    
    }
    td = -1
  }
  return [dl, td]
}

// -----------------------------------------------------------------------------
class Pumpkin extends React.Component {
  constructor(props) { super(props); this.state = {
    aoraw: '',                               // as-of / current-time as entered
    dlraw: '',                               // deadline as entered
    ao: unixtm(),                            // as-of / current-time in unixtime
    nw: true,                                // auto-refresh as-of to be _now_
    dl: unixtm(dayfloor(new Date()))+86400,  // deadline in unixtime
    td: -1,             // time to deadline in seconds (invariant: dl<0 or td<0)
    tz: BTZ, 
  } }
  
  // Glitch mistakenly says syntax error on next line but it's fine, really!
  dl = () => this.state.dl < 0 ? this.state.ao + this.state.td : this.state.dl

  doomTill   = () => beetils.doomString(this.dl(), "countdown", this.state.tz,
                                        this.state.ao,          this.state.tz)
  doomWhen   = () => beetils.doomString(this.dl(), "calendar",  this.state.tz, 
                                        this.state.ao,          this.state.tz)
  doomWhenTZ = () => beetils.doomString(this.dl(), "calendar",  "_not_a_TZ_!", 
                                        this.state.ao,          this.state.tz)

  tick = () => { if (this.state.nw) this.setState({ ao: unixtm() }) }
  
  red = (s) => `<font color="#FF0000">${s}</font>`
  
  componentWillMount = () => { setInterval(this.tick, 1000) }
  
  chgA = e => { // do this when the as-of / current-time field changes
    const v = e.target.value.trim() // contents of the actual field
    if (/^\s*(?:now)?\s*$/i.test(v)) { // as-of is "now" or blank
      this.setState({aoraw: v, ao: unixtm(), nw: true })
    } else {
      this.setState({aoraw: v, ao: parsedate(v, this.state.tz), nw: false})
    }
  }
  
  chgD = e => { // do this when the deadline field changes
    let v = e.target.value.trim() // contents of the actual field
    const [dl, td] = parsedl(v, this.state.tz)
    this.setState({dlraw: v, dl, td})
  }
  
  chgT = e => { // do this when the timezone field changes
    const v = e.target.value // contents of the actual field
    const tz = /^\s*$/.test(v) ? BTZ : v
    const ao       = parseao(this.state.aoraw, tz)
    const [dl, td] = parsedl(this.state.dlraw, tz)
    this.setState({tz, ao, dl, td})
  }
  
  render() { return ( <div>
    <div className="control-group">
      <label className="control-label" for="heep">
        Current/as-of time (YMDHMS or unixtime):
      </label>
      <div className="controls">
        <input className="form-control" type="text" autofocus
               placeholder="time of day, default now"
               //value={genTOD(now())} // doing this doesn't let you edit it :(
               onChange={this.chgA}/>
      </div>
      <br></br>
      <label className="control-label" for="dead">
        Deadline (as above or, e.g., +{beetils.genHMS(1*3600+5*60)}):
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="time of day or amount of time" 
               onChange={this.chgD}/>
      </div>
      <br></br>
      <label className="control-label" for="tz">
        Timezone string:
      </label>
      <div className="controls">
        <input className="form-control" type="text"
               placeholder="e.g., America/Los_Angeles" 
               onChange={this.chgT}/>
      </div>
    </div>
    <h2>Canonicalized Inputs</h2>
    <p><font size="+2">As of: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      {shd(this.state.ao, this.state.tz, true)}</font> &nbsp;&nbsp;
      <font size="-4">{Math.round(this.state.ao)}</font>
    </p>
    <p><font size="+2">Deadline: &nbsp;
      {shd(this.dl(), this.state.tz, true)}</font>
      &nbsp; &nbsp;
      <font size="-4">{Math.round(this.dl(), this.state.tz)}</font>
    </p>
    <p><font size="+2">Timezone: {' '}
      {beetils.tzDescribe(this.state.tz, this.dl())}</font></p>
    <h2>Outputs</h2>
    <font size="+2">
    <p><div dangerouslySetInnerHTML={{__html: 
      this.dl() - this.state.ao < 0 ? this.red(this.doomTill()) :
                                      this.doomTill()}}/></p>
    <p>{this.doomWhen()}</p>
    <p>{this.doomWhenTZ()}</p>
    </font>
{/* <p><font color={GRAY}>[DEBUG: 
  {this.state.ao}, {this.state.nw ? "now" : "fixed"}, 
  dl={this.state.dl}, td={this.state.td}, {this.state.tz}]</font></p> 
*/}
    <p><font color={GRAY}>For adding the above to the qual suite:<br/> <pre>[
      {this.state.ao}, {this.dl()}, {constify(this.state.tz)},
      "{this.doomTill()}", "{this.doomWhen()}", "{this.doomWhenTZ()}"],</pre>
{/* "{beetils.doomTill(this.state.ao, this.dl())}",
    "{beetils.doomWhen(this.state.ao, this.dl(), false, this.state.tz)}",
    "{beetils.doomWhen(this.state.ao, this.dl(), true,  this.state.tz)}"],</pre>
*/}
    </font></p>
  </div> ) }
}

ReactDOM.render(<Pumpkin/>, document.getElementById('root'))

/******************************************************************************
 *                              STATIC WEBSITE                                *
 ******************************************************************************/

// Take a prefix string p and a string s and return what's left of s after 
// removing the prefix p. Eg, deprefix("cat", "catenary") -> "enary". If p is 
// not actually a prefix of s then all bets are off.
function deprefix(p, s) {
  return s.indexOf(p) !== 0 ? ' ~ ' + s : s.substring(p.length)
}

// Eg, commonprefix("abc", "abx") -> "ab"
function commonprefix(a, b) {
  if (!a || !b || !a.length || !b.length || a.charAt(0)!==b.charAt(0)) return ''
  return a.charAt(0) + commonprefix(a.slice(1), b.slice(1))
}

// Canonicalize spaces, namely, replace weirdo thin spaces with normal ones
function kaspace(s) { return s.replace(/\s/g, ' ') }

// Take qual number, as-of time, deadline, timezone; return list of html strings
// for inserting into the table
function gussy(i, ao, dl, tz, trel, tabs, tabstz) {
  tz = tz === null ? BTZ : tz
  const trel2   = beetils.doomString(dl, "countdown", tz,          ao, tz)
  const trel2c  = dl-ao < 0 ? `<font color="#FF0000">${trel2}</font>` : trel2
  const tabs2   = beetils.doomString(dl, "calendar",  tz,          ao, tz)
  const tabstz2 = beetils.doomString(dl, "calendar",  "MAGIC1638", ao, tz)
  const sao     = shd(ao, tz)
  const sdl     = shd(dl, tz)
  const sdlpre  = commonprefix(sao, sdl)
  const sdlpost = deprefix(sdlpre, sdl)
  const stz     = beetils.tzAbbr(tz)
  const strel   = trel===kaspace(trel2) ? trel2c : '<s>'+trel+'</s><br>'+trel2c
  const ftag    = `<font color=${GRAY}>`
  const stabs1  = `${tabs}${ftag}${deprefix(tabs, tabstz)}</font>`
  const stabs2  = `${tabs2}${ftag}${deprefix(tabs2, tabstz2)}</font>`
  const stabs   = stabs1===stabs2 ? stabs1 : `<s>${stabs1}</s><br>${stabs2}`
  const gray = s => `<font color=${GRAY}>${s}</font>`
  const red  = s => `<font color="#B31B1B">${s}</font>`

  return [
    //`<font color=${GRAY} size="-5">${i}</font>`,
    `<pre><font color=${GRAY} size="-5">${i}  </font>` +
    `${sao} &xrarr; ${sdlpre}${red(sdlpost)} ${gray('('+stz+')')}</pre>`,
    //`<pre>${sdl}</pre>`,
    //`<pre>${stz}`,
    `${strel}`, 
    `${stabs}`, 
  ]
}

// Generate a big string to display on the on the web page that can be pasted
// in to replace the qual suite, for when we make a change we like and want to 
// update all the reference outputs. Like hitting R in automon.
function gensuite() {
  let s = ''
  let ao, dl, tz, trel, tabs, tabstz
  suite.forEach(row => {
    [ao, dl, tz] = row
    trel   = beetils.doomString(dl, "countdown", tz,          ao, tz)
    tabs   = beetils.doomString(dl, "calendar",  tz,          ao, tz)
    tabstz = beetils.doomString(dl, "calendar",  "MAGIC1639", ao, tz)
    s += 
      `[${ao}, ${dl}, ${constify(tz)}, "${trel}", "${tabs}", "${tabstz}"],\n`    
  })
  return s
}

// Take a list and insert it as a row in the html table at position r
function insertrow(row, r=0) {
  const htmlrow = document.getElementById('ttable').insertRow(r)
  row.forEach((c,i) => htmlrow.insertCell(i).innerHTML = c)
}

// TODO: This +18 is to make the row number in the html match the line numbers
// of the qual suite rows in the code. Normally it'd just be +1 to start at 1:
suite.forEach((row,i) => insertrow(gussy(i+18, ...row), -1))

document.getElementById('gsuite').innerHTML = gensuite()

/******************************************************************************
 *                                 QUAL SUITE                                 *
 ******************************************************************************/

let nqual = 0 // count how many quals we do
let npass = 0 // count how many pass

// Take a boolean assertion and a message string; print a warning to the browser
// console if the assertion is false. Also increment the qual counter.
// (But mainly I wanted to just type "assert" instead of "console.assert")
function assert(qual, msg) {
  nqual += 1
  npass += qual
  console.assert(qual, msg)
}

function qualsuite() {
  nqual = npass = 0
  let ao, dl, tz, trel, tabs, tabstz // the 6 fields in a qual suite row
  let trel2, tabs2, tabstz2 // calculated versions of above for comparison
  suite.forEach(row => {
    [ao, dl, tz, trel, tabs, tabstz] = row
    trel2   = beetils.doomString(dl, "countdown", tz,          ao, tz)
    tabs2   = beetils.doomString(dl, "calendar",  tz,          ao, tz)
    tabstz2 = beetils.doomString(dl, "calendar",  "MAGIC1436", ao, tz)
    assert(kaspace(trel2) === trel && tabs2 === tabs && tabstz2 === tabstz,
           `ERROR: ${shd(ao)} - ${shd(dl)} (${beetils.tzAbbr(tz)}): ` +
           (trel   === trel2   ? '✓ | ' : `${trel} → ${trel2} | `) +
           (tabs   === tabs2   ? '✓ | ' : `${tabs} → ${tabs2} | `) +
           (tabstz === tabstz2 ? '✓ | ' : `${tabstz} → ${tabstz2}`))
  })
  return npass + "/" + nqual + " quals passed"
}
console.log(qualsuite()) // uncomment when testing


/******************************************************************************
 *                      STUFF WE'RE NOT CURRENTLY USING                       *
 ******************************************************************************/

/* QUALS for tzDescribe:
console.log(tzDescribe("America/Los_Angeles", true))
console.log(tzDescribe("America/Los_Angeles", false))
console.log(tzDescribe("America/Caracas", true))
console.log(tzDescribe("America/Caracas", false))
console.log(tzDescribe("Asia/Irkutsk", true))
console.log(tzDescribe("Asia/Irkutsk", false))
*/

/* Original version of tzDescribe:
// Take a timezone string tz like "America/Los_Angeles" and a boolean saying
// whether we want the full string with UTC offset like "(UTC+03)" and return a
// a human-friendly string describing the timezone like "PDT" (if full=false)
// or "PDT (UTC-07)" (if full=true).
// Technical note: To escape characters in a format string, wrap them in square
// brackets.
function tzDescribe(tz, full) {
  var date = moment.tz(tz)
  var tzstr = ''
  if (date.format('z').match(/^[a-z]+$/i)) {
    // check if the timezone has a friendly abbreviation
    tzstr = date.format('z')
  } else {
    // ow: use the city portion of the tz string
    tzstr = tz.replace(/^.*\//, '').replace(/_/g, ' ')
  }
  if (full) {
    tzstr = '['+tzstr+'] (UTCZ)'
    return date.format(tzstr).replace(/:00/,'')
  } else {
    return date.format('(['+tzstr+'])')
  }
*/

/*
// 
// this is a thing that's just included here because it shares in common the
// tzDescribe function that's describe & used above.
//
// update deadline tooltip if browser tz does not match usertz
function updateDeadTooltip() {
  var usertz = $(".hero .doom").data("tz"); // passed in info about what timezone the Actual User is in
  var browsertz = moment.tz.guess();        // get timezone info from the browser (i.e. timezone of Viewing User)
  if (usertz != browsertz) {
    var deadtime = $(".hero .doom").data("deadtime");
    var browserdead = moment.tz(deadtime*1000, browsertz); 
    var tzstr = tzDescribe(browsertz, true);
      
    // and now we're going to paste them together and set the tooltip
    $(".hero .doom").attr("title",
      $(".hero .doom").attr("title") + browserdead.format("[ / "+tzstr+"] HH:mm")
    ).tooltip();
  } else {
    $(".hero .doom").tooltip();
  }
}
*/

/* first stab at a showdate function
  const date = new Date(t*1000)
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + 1
  const d = date.getUTCDate()
  const H = date.getUTCHours()
  const M = date.getUTCMinutes()
  const S = date.getUTCSeconds()
  const dd = function(x) { return x < 10 ? '0'+x : x } // double-digit-ify
  return y+'-'+dd(m)+'-'+dd(d)+'_'+dd(H)+':'+dd(M)+':'+dd(S)+' UTC'
*/

/*
const tzl = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Bamako", "Africa/Bangui", 
"Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", 
"Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", 
"Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", 
"Africa/Juba", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", 
"Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", 
"Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", 
"Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", 
"America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", 
"America/Argentina/Catamarca", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", 
"America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/Salta", "America/Argentina/San_Juan", 
"America/Argentina/San_Luis", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", 
"America/Atikokan", "America/Bahia", "America/Bahia_Banderas", "America/Barbados", "America/Belem", "America/Belize", 
"America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Cambridge_Bay", "America/Campo_Grande", 
"America/Cancun", "America/Caracas", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", 
"America/Costa_Rica", "America/Creston", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", 
"America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", 
"America/El_Salvador", "America/Fortaleza", "America/Fort_Nelson", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", 
"America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", 
"America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", 
"America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", 
"America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Inuvik", "America/Iqaluit", "America/Jamaica", 
"America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Kralendijk", 
"America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Lower_Princes", "America/Maceio", "America/Managua", 
"America/Manaus", "America/Marigot", "America/Martinique", "America/Matamoros", "America/Mazatlan", "America/Menominee", 
"America/Merida", "America/Metlakatla", "America/Mexico_City",  "America/Miquelon", "America/Moncton", "America/Monterrey", 
"America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", 
"America/Nome", "America/Noronha", "America/North_Dakota/Beulah", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", 
"America/Ojinaga", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", 
"America/Port_of_Spain", "America/Porto_Velho", "America/Puerto_Rico", "America/Punta_Arenas", "America/Rainy_River", 
"America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Santa_Isabel", 
"America/Santarem", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/Sitka", 
"America/St_Barthelemy", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", 
"America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", 
"America/Tortola", "America/Vancouver", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", 
"Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Macquarie", "Antarctica/Mawson", "Antarctica/McMurdo", 
"Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/Syowa", "Antarctica/Troll", "Antarctica/Vostok", "Arctic/Longyearbyen", 
"Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Atyrau", 
"Asia/Baghdad", "Asia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Barnaul", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", 
"Asia/Chita", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Colombo", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", 
"Asia/Dushanbe", "Asia/Famagusta", "Asia/Gaza", "Asia/Harbin", "Asia/Hebron", "Asia/Ho_Chi_Minh", "Asia/Hong_Kong", "Asia/Hovd", 
"Asia/Irkutsk", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", 
"Asia/Kathmandu", "Asia/Khandyga", "Asia/Kolkata", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", 
"Asia/Kuwait", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novokuznetsk", 
"Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qostanay", 
"Asia/Qyzylorda", "Asia/Riyadh", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", 
"Asia/Srednekolymsk", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Thimphu", "Asia/Tokyo", "Asia/Tomsk", 
"Asia/Ulaanbaatar", "Asia/Urumqi", "Asia/Ust-Nera", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yangon", 
"Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", 
"Atlantic/Faroe", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/Stanley", "Atlantic/St_Helena", 
"Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", 
"Australia/Hobart", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/Perth", "Australia/Sydney", 
"Europe/Amsterdam", "Europe/Andorra", "Europe/Astrakhan", "Europe/Athens", "Europe/Belgrade", "Europe/Berlin", 
"Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Busingen", "Europe/Chisinau", 
"Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man", 
"Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Kirov", "Europe/Lisbon", "Europe/Ljubljana", 
"Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco", 
"Europe/Moscow", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", 
"Europe/San_Marino", "Europe/Sarajevo", "Europe/Saratov", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia", 
"Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Ulyanovsk", "Europe/Uzhgorod", "Europe/Vaduz", 
"Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "Europe/Volgograd", "Europe/Warsaw", "Europe/Zagreb", 
"Europe/Zaporozhye", "Europe/Zurich", "GMT", "GMT-1", "GMT+1", "GMT-10", "GMT+10", "GMT+10.5", "GMT-11", "GMT+11", "GMT-12", 
"GMT+12", "GMT+12.75", "GMT+13", "GMT+14", "GMT-2", "GMT+2", "GMT-3", "GMT+3", "GMT-3.5", "GMT+3.5", "GMT-4", "GMT+4", "GMT+4.5", "GMT-5", 
"GMT+5", "GMT+5.5", "GMT+5.75", "GMT-6", "GMT+6", "GMT+6.5", "GMT-7", "GMT+7", "GMT-8", "GMT+8", "GMT+8.75", "GMT-9", "GMT+9", "GMT-9.5", 
"GMT+9.5", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", 
"Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", 
"Pacific/Apia", "Pacific/Auckland", "Pacific/Bougainville", "Pacific/Chatham", "Pacific/Chuuk", "Pacific/Easter", 
"Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", 
"Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", 
"Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", 
"Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", 
"Pacific/Pohnpei", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Tahiti", "Pacific/Tarawa", 
"Pacific/Tongatapu", "Pacific/Wake", "Pacific/Wallis", "UCT", "UTC"]
*/

// -----------------------------------------------------------------------------

Construct a string saying when a deadline will be.
[migrated from Glitch on 2025-06-20]

Gissues: 
[#221](https://github.com/beeminder/beeminder/issues/221) and
[#1414](https://github.com/beeminder/beeminder/issues/1414) and
[#514](https://github.com/beeminder/beeminder/issues/514)

Goal: A nice modular function that takes the timestamp of a deadline and returns a helpful string to show a human, telling them when, relative to now, that deadline will be.

Also let's have it show the time ago if the deadline is past and display that in red so it's nice and obvious that the deadline's past due. So not just "time's up".

## UVIs

1. Fix the "tomorrow" bug where goals with certain deadlines in certain timezones would say "due tomorrow" instead of "due today" or vice versa
2. We were missing the timezone abbreviation for Guam (ChST) since it's not all caps like the others.
3. TODO: We've been saying "time's up" for the goal countdown 1 second too late; now fixed!
4. TODO: Show just hours all the way up to "47h 59m 59s" before switching to days like "2d"
5. TODO: Thinner spaces in amounts of time like "3d 4h 5s" (so in between that and "3d4h5s")


## Namestorming

* doomstring (original name in the Beeminder code)
* pumpkintime (when you turn into a pumpkin)
* deadleinstein (relative deadline, get it?)
* deadlein (for short)
* doomtime
* teatime (like time t, the time of interest, as in "t minus...")

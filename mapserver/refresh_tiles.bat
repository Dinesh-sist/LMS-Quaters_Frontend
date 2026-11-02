@echo off
cd /d C:\ms4w
call setenv.bat
mapcache_seed -c C:\ms4w\apps\mapcache\mapcache.xml -t quarters -g GM21 -z 10,18 -e 9640000,2296000,9657000,2315000 -n 4 -f
mapcache_seed -c C:\ms4w\apps\mapcache\mapcache.xml -t quarters -g GM21 -z 19,20 -e 9644300,2303000,9653800,2307900 -n 4 -f
pause

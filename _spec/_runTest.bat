setlocal EnableDelayedExpansion
del /q /s .\_spec\coverage\json_files\*.json
for /f %%j in ('karma start _spec/karma.conf.js') do set karmaRe=%%j
for /f  %%i in ('node _spec/mergeCoverageForIstanbul.js') do set re=%%i
istanbul report html _spec/coverage/json_files/%re%.json
pause

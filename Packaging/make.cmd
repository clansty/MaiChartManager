del .\*.appx

set PATH=%PATH%;"C:\Program Files (x86)\Windows Kits\10\bin\10.0.26100.0\x64";"C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64"

pushd Pack

del .\priconfig.xml
del .\*.pri
makepri.exe createconfig /cf priconfig.xml /dq zh-CN
makepri.exe new /pr . /cf .\priconfig.xml
del .\priconfig.xml
makeappx pack /d . /p ../Store64.appx
del .\*.pri
del .\*.appx

pushd ..
msbuild /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=FolderProfile
popd

pushd Pack

del .\priconfig.xml
del .\*.pri
makepri.exe createconfig /cf priconfig.xml /dq zh-CN
makepri.exe new /pr . /cf .\priconfig.xml
del .\priconfig.xml
makeappx pack /d . /p ../Store64.appx
del .\*.pri

pause

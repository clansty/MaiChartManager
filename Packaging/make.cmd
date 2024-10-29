cd %~dp0
del .\*.appx
rmdir /s /q Pack

pushd ..\MaiChartManager\Front
call pnpm build
popd

pushd ..
msbuild /p:Configuration=Release /p:DeployOnBuild=true /p:PublishProfile=FolderProfile
popd

copy Base\* Pack
pushd Pack

del .\priconfig.xml
del .\*.pri
makepri.exe createconfig /cf priconfig.xml /dq zh-CN
makepri.exe new /pr . /cf .\priconfig.xml
del .\priconfig.xml
makeappx pack /d . /p ../Store64.appx

pause

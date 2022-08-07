where node || (
 curl https://nodejs.org/dist/v16.16.0/node-v16.16.0-x64.msi > nodeinstall.msi
  msiexec.exe /a %~dp0nodeinstall.msi
)

npm i
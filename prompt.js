const SteamUser = require("steam-user");
const fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt() {
  return new Promise(resolve => {
    console.log("WARNING: THIS SCRIPT WILL SAVE A LOGIN KEY TO LOG IN TO STEAM. THIS DOES NOT SAVE YOUR PASSWORD ANYWHERE, BUT PEOPLE CAN STILL LOG IN WITH THE KEY. THIS KEY IS STORED IN PLAIN TEXT, SO MAKE SURE YOUR PC DOESN'T HAVE ANY MALWARE ON IT.")
    readline.question('Username: ', accountName => {
      readline.question('Password: ', password => {

        let steamUser = new SteamUser();
        steamUser.on("loginKey", (loginKey) => {
          let config = {
            accountName,
            loginKey
          }
          if (!fs.existsSync(`${process.env.APPDATA}/KillMultiversusClient`))
            fs.mkdirSync(`${process.env.APPDATA}/KillMultiversusClient`);
          fs.writeFileSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`, JSON.stringify(config))
          readline.close();
          steamUser.logOff()
        })
        steamUser.on("disconnected", () => {
          console.log("Updated")
          resolve()
          process.exit(0)
        })
        steamUser.logOn({ accountName, password: password, rememberPassword: true });
      });
    });
  })
}

prompt()
const SteamUser = require("steam-user");
const fetch = require("node-fetch");
const apiKey = "51586fdcbd214feb84b0e475b130fce0" // This is global for all users, don't think it's like my api key or something
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
          resolve()
        })
        steamUser.logOn({ accountName, password: password, rememberPassword: true });
      });
    });
  })
}

async function main() {
  if (!fs.existsSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`)) {
    await prompt();
  }

  let { accountName, loginKey } = JSON.parse(fs.readFileSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`));

  let steamUser = new SteamUser();

  steamUser.on("loginKey", (loginKey) => {
    let config = {
      accountName,
      loginKey
    }
    if (!fs.existsSync(`${process.env.APPDATA}/KillMultiversusClient`))
      fs.mkdirSync(`${process.env.APPDATA}/KillMultiversusClient`);
    fs.writeFileSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`, JSON.stringify(config))
  })

  steamUser.on("error", () => {
    console.log("There was an error logging in. Try updating your credentials. Exiting in 5 seconds.")
    setTimeout(() => {
      process.exit(0)
    }, 5000)
  })

  steamUser.logOn({ accountName, loginKey });

  console.log("Killing client")

  steamUser.on("loggedOn", () => {
    steamUser.createEncryptedAppTicket(1818750, async (err, appTicket) => {
      if (err) {
        console.error(err);
        return;
      }

      fetch(`https://dokken-api.wbagora.com/access`, {
        headers: {
          'x-hydra-api-key': apiKey,
          'x-hydra-user-agent': 'Hydra-Cpp/1.132.0',
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ auth: { steam: appTicket.toString("hex"), fail_on_missing: true } })
      })
        .then(() => {
          console.log("Client killed")
          process.exit(0)
        })
    })
  })
}

main();


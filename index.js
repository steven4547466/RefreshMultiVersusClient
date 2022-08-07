const SteamUser = require("steam-user");
const fetch = require("node-fetch");
const apiKey = "51586fdcbd214feb84b0e475b130fce0"
const fs = require("fs");
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt() {
  return new Promise(resolve => {
    console.log("WARNING: I DON'T CARE ABOUT MY ACCOUNT SECURITY BECAUSE MY PASSWORD IS RANDOMLY GENERATED AND I HAVE 2FA AND STEAM GUARD ON. IF YOU CARE ABOUT YOUR ACCOUNT SECURITY, PLEASE DO NOT USE THIS SCRIPT. THE PASSWORD IS STORED IN PLAIN TEXT!!!!")
    readline.question('Username: ', name => {
      readline.question('Password: ', password => {
        let config = {
          username: name,
          password: password
        }
        if (!fs.existsSync(`${process.env.APPDATA}/KillMultiversusClient`))
          fs.mkdirSync(`${process.env.APPDATA}/KillMultiversusClient`);
        fs.writeFileSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`, JSON.stringify(config))
        readline.close();
        resolve();
      });
    });
  })
}

async function main() {
  if (!fs.existsSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`)) {
    await prompt();
  }


  let { username, password } = JSON.parse(fs.readFileSync(`${process.env.APPDATA}/KillMultiversusClient/config.json`));

  let steamUser = new SteamUser();
  steamUser.logOn({ accountName: username, password: password });

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


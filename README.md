# What is this?
This is a simple tool to force your connection to MultiVersus to close.

# Why?
Alt+F4'ing out of this game and restarting it can take forever because EAC is hot garbage.

And sometimes you don't want to play against Bugs for the 10th time in a row, so using this tool just makes it easy to dodge a game.

# DISCLAIMER
While I haven't been banned, I can't say for certain if this is allowed (though I can't see why it wouldn't be, it's literally equivalent to relogging).

**Also, when you first set this up it will warn you that the login key is stored in plain text, please heed this warning if you don't use 2FA and/or steam guard**. When you first use this tool it will more than likely prompt you for a steam guard code, just enter it into the command prompt.

This is fully open source, so you can see I'm not sending the info anywhere, it all stays local on your computer.

# How does it work?
The game doesn't allow a user to be logged in twice, so it fakes a login using this tool. Basically, it logs in to steam, generates a new token for your client, and then sends a message to the game saying that you logged in again. This boots your original session. If you do this mid game, you will be given a loss. So if you're going to dodge, don't be an idiot and try to not get the consequences of your garbage play and dodge before the game starts.

# How to use:
For first time users, run `setup-node.bat` this will install `node.js` (a javascript runtime environment: https://nodejs.org/) and install it on your computer. It will pop up with a little application installer if you don't already have node installed.

It will then download the dependencies needed for this to work. Those are `steam-user`, which allows the application to login, and `node-fetch` which makes http requests simple.

When you want to use it, run `kill.bat`. If it is your first time using, it'll probably ask for a steam guard code. After a few seconds you'll get booted off the game with a message to check your connection. Just do any input to log in again.

While this script will ask for a password, it is only needed once in order to obtain a login key. Password is not saved anywhere.
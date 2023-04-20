const Discord   = require("discord.js");
const bot       = new Discord.Client();
const botconfig = require("./botconfig.json");

const search    = require('node-yt-search');

const APIKey    = botconfig.APIKey;
const CSEId     = botconfig.CSEId;

const GoogleImages  = require('google-images');
const client        = new GoogleImages(CSEId, APIKey);

//  Load Languages
//////////////////////////////////////////////////////
const english    = require('./languagelists/english.json');
const arabic     = require('./languagelists/arabic.json');
const chinese    = require('./languagelists/chinese.json');
const french     = require('./languagelists/french.json');
const german     = require('./languagelists/german.json');
const greek      = require('./languagelists/greek.json');
const hebrew     = require('./languagelists/hebrew.json');
const japanese   = require('./languagelists/japanese.json');
const korean     = require('./languagelists/korean.json');
const spanish    = require('./languagelists/spanish.json');
const swedish    = require('./languagelists/swedish.json');
const hindi      = require('./languagelists/hindi.json');
const russian    = require('./languagelists/russian.json');
const vietnamese = require('./languagelists/vietnamese.json');
//////////////////////////////////////////////////////

//  spaghet
let languageArray = [english, arabic, chinese, french, german, greek, hebrew, japanese, korean, spanish, swedish, hindi, russian, vietnamese];

//  YouTube / game stuff
//////////////////////////////////////////////////////
var searchString;   //  string to put in youtube search
var randomLanguage;
var numberOfResults = 42; //max. 50
var videoViews      = 0;  //  initialize

var gamecommand, gameNr, playerIsHost, gameNotification;

let maxGames  = 1;
var gameCount = 0;

//  gg youtube game
var games = [];

let opts = { //options
  maxResults: numberOfResults,
  pageToken: '',
  videoPart: 'snippet,statistics', //id??
  key: APIKey, //my YT API key
};
//////////////////////////////////////////////////////

////  Server specifics and variables
//////////////////////////////////////////////////////

const owner_id          = botconfig.ownerID;
const gamingChannelId   = botconfig.gamingChannelId;
const welcomeChannelID  = botconfig.welcomeChannelID;

//emojis
//space emoji

const spaceEmoji = "<:space:536568350248009749>";

//////////////////////////////////////////////////////

//  login bot
bot.login(botconfig.token);

bot.on("ready", async () => {
  console.log(bot.user.username + ' is online!!');
  bot.user.setActivity("Space Invaders 🚀");
});

//////////////////////////////////////////////////////

//  Message handling
bot.on("message", async message => {


  if (message.author.bot) return; //  prevent feedbacks

  if (message.content.indexOf(botconfig.prefix) !== 0) return;

  const args = message.content.slice(botconfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  //////////////////////////////////////////////////////////////
  /////////// B O T    C O M M A N D S

  switch ( command ) {

    default: message.channel.send("Command not found...");
    break;

    ///////////////////////////////////////////////////////////
    //////  U S E R    C O M M A N D S

    //////////////////////////////////////////////////////
    //  Display help messages
    case "commands":
        //nothing here yet
      break;

    //////////////////////////////////////////////////////

    //--------------------------------
    //---- Info Commands

    //////////////////////////////////////////////////////
    //  Send private message with comprices
    case "commissions": //dunno if this is so great
    case "commissionprices":
    case "commissionprice":
    case "commission":
    case "comission":
    case "coms":
    case "commissions":

      message.author.send("Hey, we're glad you're interested in commissioning jambuzzed <3\nCommission prices will soon be here! ;D");

      break;

    //////////////////////////////////////////////////////
    //  Have the bot say something
    case "say":

      message.channel.send("knecki");

      /*const sayMessage = args.join(" ");
      message.delete().catch(O_o => {});
      message.channel.send(sayMessage);*/

      break;

    //////////////////////////////////////////////////////
    //  YouTube guessing game
    case "gg":

    if(message.channel.id == gamingChannelId) {

      gamecommand = args[0];
      gameNr = gameNumber(message.author.discriminator); //game number of message author...gameNr[0] will be the number of the game, [1] the permissions ()
      playerIsHost = isHost(message.author.discriminator);
      gameNotification = "no notification has been sent"; //display

      switch (gamecommand) {

        default: gameNotification = "Game command not found..."; //maybe tutorial here
        break;

        //initialize a new game
        case "new":

            //add new game... append to games array
            if (gameNr == -1 && gameCount < maxGames) { //if host was not found/author has no game yet

              games.push({

                host: message.author.discriminator,
                players: [message.author.discriminator],
                usernames: [],
                guesses: [],
                guessCount: 0,
                differences: [],
                scores: [],
                rounds: 0,
                next: false,
                endCondition: false,

              });

              gameCount++;
              gameNotification = "New Game Created!";

            } else if (gameCount >= maxGames) {

              gameNotification = "There is already a game running!";

            } else if (playerIsHost) {

            gameNotification = "You already host a game!";

            } else if (gameNr >= 0) {

              gameNotification = "You are already part of a game!";

            }

          break;

          //add a player to the game
        case "addplayer": //maybe clean up logic later

            if (gameNr >= 0 && args[1] != undefined && playerIsHost && games[gameNr].rounds == 0 && !games[gameNr].players.includes(args[1])) {

              games[gameNr].players.push(args[1]); //append to players list of respective game

              gameNotification = "Player " + args[1] + " added as Player " + games[gameNr].players.indexOf(args[1]) + "!";

            } else if (gameNr < 0) {

            gameNotification = "You should create a new game first using ?sssssssssssss new";

          } else if (args[1] == undefined) {

            gameNotification = "__Command usage:__\n*?gg addplayer [playerDiscriminator]*\n" + spaceEmoji + "\nYou can get the discriminator by clicking on a user and copying the number following their username (i.e username#**1234**)!";

          } else if (games[gameNr].rounds > 0) {

            gameNotification = "You can't add new players to a running game.";

          } else if (games[gameNr].players.includes(args[1])) {

            gameNotification = "The player you tried to add is already added."

          }

          break;

          //start your game
        case "start":

            if (playerIsHost) {

              if (games[gameNr].rounds == 0) {

                games[gameNr].rounds = 1; //designates if a game is running, as well as round number
                games[gameNr].next = true; //

                //initialize scores
                for (var i = 0; i < games[gameNr].players.length; i++) {

                  games[gameNr].scores[i] = 0;

                }

                gameNotification = "The Game has Started! Video coming in...";

              } else {

                gameNotification = "Please finish or stop your game first, before you start a new game."

              }

            } else {

              gameNotification = "You need to be a host to start a game!";

            }

          break;

          //stop your game
        case "stop":

            if (gameNr >= 0 && playerIsHost || message.member.id == owner_id) { //only playerIsHost would suffice

              games.splice(gameNr, 1) //empty game
              gameNr = -1;
              gameCount -= 1;
              gameNotification = "Your game has been stopped!";

            } else {

              gameNotification = "You can't stop a game if you're not the host, nice try!";

            }

          break;

          //take a guess
        case "guess":

            message.delete().catch(O_o => {}); //delete message, so that guess doesn't show

          //count guesses ... match with number of Players
          if (gameNr >= 0 && games[gameNr].rounds > 0) {

            //until here, everything is fine and should be in the future
            var guess = args[1];

            if (guess != undefined && guess.match(/^[0-9]+$/) != null && Number(guess) >= 0) { //guess should match criteria: positive number and not empty

              if (games[gameNr].guesses.includes(guess)) {

                gameNotification = "Don't guess the same number as your mate!";

              } else {

                //guess format fine

                //let player guess multiple times?..overwrite???

                var playerNr = games[gameNr].players.indexOf(message.author.discriminator);
                //now comes a little hackish code... the discriminator is "converted" to a username, then the username is assigned to games object, try to remove if problems occur
                games[gameNr].usernames[playerNr] = message.author.username;


                //assign player guess to array
                games[gameNr].guesses[playerNr] = guess;
                games[gameNr].guessCount += 1;
                //notify about guess
                gameNotification = "✔ *" + games[gameNr].usernames[playerNr] + "* guessed.\n"; //+ guess + " views.\n"; //you could replace username and guess with simpler vars, but for control this is used, change later to simpler

                if (games[gameNr].guessCount == games[gameNr].players.length) { //if guesses array is "full", number of guesses == number of players games[gameNr].guesses.length == games[gameNr].players.length

                  gameNotification += "----------------\n";


                  for (var i = 0; i < games[gameNr].guesses.length; i++) {

                    //99 = ytviews
                    games[gameNr].differences[i] = Math.abs(videoViews - Number(games[gameNr].guesses[i]));

                  }

                  var minDiff = Math.min.apply(Math, games[gameNr].differences);
                  var indexArray = [];

                  for (var i = 0; i < games[gameNr].guesses.length; i++) {

                    if (games[gameNr].differences[i] == minDiff) {

                      indexArray.push(i); //get the indexes of the winners into array, there are rarely multiple winners, but it can happen

                    }
                  }

                  //display video Views
                  gameNotification += spaceEmoji + "\nThe video has " + videoViews + " views!\n" + spaceEmoji + "\n";

                  //increment score and display winner(s)
                  for (var i = 0; i < indexArray.length; i++) {

                    games[gameNr].scores[indexArray[i]] += 1; //increment their score
                    gameNotification += "**" + games[gameNr].usernames[indexArray[i]] + "** was the closest with **" + games[gameNr].guesses[indexArray[i]] + "** (off by " + minDiff + ").\n";

                  }

                  //display score Board
                  gameNotification += spaceEmoji + "\n" + spaceEmoji + "\n*Score Board: Round " + games[gameNr].rounds + "* \n///////////////////////////\n" + spaceEmoji + "\n";

                  for (var i = 0; i < games[gameNr].players.length; i++) {

                    var userName = games[gameNr].usernames[i];

                    if (games[gameNr].scores[i] == Math.max.apply(Math, games[gameNr].scores)) {

                      //highlight player(s) with the highest score
                      gameNotification += "🔸 **" + userName + "** : **" + games[gameNr].scores[i] + "**\n"; //maybe a crown?

                    } else {

                      gameNotification += "◆ " + userName + ": " + games[gameNr].scores[i] + "\n";

                    }
                  }

                  gameNotification += spaceEmoji + "\n///////////////////////////\n" + spaceEmoji + "\n" + spaceEmoji + "\n";

                  games[gameNr].rounds += 1; //increment rounds
                  games[gameNr].next = true; //give signal for next video

                }
              }
            } else {

              gameNotification = message.author.username + ", make sure your guess is a number!";

            }


          } else {

            gameNotification = "Please start or create a new game first!";

          }

          break;

        case "next":

            if (gameNr >= 0 && !games[gameNr].next && playerIsHost) {

              games[gameNr].next = true;
              gameNotification = "Next video coming in...\n"

            } else {

              gameNotification = "You can't use this\n";

            }

          break;

        case "rules":
          gameNotification = "There should be a graphic explaining the rules here, get working Jambuzzed T.T";
          break;

      } //end of switch(gamecommand)

      message.channel.send(gameNotification); //send notification


      if (gameNr >= 0 && games[gameNr].next) {

        if (games[gameNr].rounds > 0) { //kinda unneccessary

          //wait 5s before sending next video/ starting next round
          setTimeout(function() {

            var sendString = "========================\n*Round " + games[gameNr].rounds + "!*\n========================\nNew Random YT Video: \n";

            //youtube code
            /////////////////////////////////////////////////////////////////
            randomLanguage = languageArray[Math.floor(Math.random() * languageArray.length)];
            searchString = randomWord(randomLanguage) + " " + randomWord(randomLanguage); //search query for youtube search, 2 word search

            sendString += "Search: " + searchString + "\n" + spaceEmoji + "\n";

            search(searchString, opts, (err, results, pageInfo) => {

              if (err) console.log(err);

              console.log(results);

              resultsNumber = pageInfo.resultsPerPage;

              if (resultsNumber > 0 && results != undefined) { //

                //message.channel.send("Number of Results: " + resultsNumber);

                var itemNr = Math.floor(Math.random() * pageInfo.resultsPerPage); //number of item in the search
                var randomID = results.items[itemNr].id; //get id

                videoViews = results.items[itemNr].statistics.viewCount;

                sendString += "https://www.youtube.com/watch?v=" + randomID;

              } else {

                sendString = "there were no results for this search, the host should use ?gg next to load a new video";

              }

              message.channel.send(sendString);

              /////////////////////////////////////////////////////////////////
               //reset next after video was sent
              games[gameNr].guessCount = 0;
              games[gameNr].guesses = []; //reset player guesses

            });

          }, 8000); //may need to take out bc of multiple sessions?
        }

        games[gameNr].next = false;

      }

    } else {

      message.channel.send("To play the YT-Guessing-Game (working title), please go to the silly-games channel! ^-^");

    }

      break; //end of gg

    //////////////////////////////////////////////////////
    //  Random YT video
    case "ytrandom":

      message.channel.send("Here's a random YT Video for you: ");

      randomLanguage = languageArray[Math.floor(Math.random() * languageArray.length)];
      searchString = randomWord(randomLanguage) + " " + randomWord(randomLanguage); //search query for youtube search
      message.channel.send("Search String: " + searchString + "\n----------------------------------------");

      //start search
      search(searchString, opts, (err, results, pageInfo) => {

        if (err) console.log(err);

        resultsNumber = pageInfo.resultsPerPage;

        if (resultsNumber > 0) { //&& results != undefined

          var itemNr = Math.floor(Math.random() * pageInfo.resultsPerPage); //number of item in the search
          var randomID = results.items[itemNr].id; //get id
          videoViews = results.items[itemNr].statistics.viewCount;

          message.channel.send("https://www.youtube.com/watch?v=" + randomID);

        } else {


          message.channel.send("0 Results for this query");

          //add some game logic in case this happens
          next = true;

        }
      });

      break;

    //////////////////////////////////////////////////////
    //  Get a random word in a (specified) language
    case "word":

      var argument = args.join(" ").toLowerCase();

      try { //eval throws an error if the argument is not defined/not a variable

        eval(argument);
        var wordy = randomWord(eval(argument));
        message.channel.send("Random " + argument + " Word: " + wordy);
        message.channel.send(" Here's a google images link for your word: \nhttps://www.google.com/search?tbm=isch&q=" + wordy);

        client.search(''+wordy)
        .then(images => {
            /*
            [{
                "url": "http://steveangello.com/boss.jpg",
                "type": "image/jpeg",
                "width": 1024,
                "height": 768,
                "size": 102451,
                "thumbnail": {
                    "url": "http://steveangello.com/thumbnail.jpg",
                    "width": 512,
                    "height": 512
                }
            }]
             */

             message.channel.send(images[Math.floor(Math.random() * 5)].url);
        });

      } catch (e) {

        message.channel.send("Language '" + argument + "' not found!");

      }

      break;

    //////////////////////////////////////////////////////

} //  END OF SWITCH-CASE
});

///////////////////////////////////////////////////////////
//////  F U N C T I O N S

function randomWord(language) {

  if (languageArray.includes(language)) {

    return language[Math.floor(Math.random() * language.length)];

  } else {

    return "language not found";

  }
}

function addPlayer(playerNumber, playerDiscriminator) {

  if (!players.includes(playerDiscriminator) && playerDiscriminator.length == 4 && playerDiscriminator.match(/^[0-9]+$/) != null) { //player discriminator needs to be 4 chars long

    players[playerNumber] = playerDiscriminator;
    lastAddSuccessful = true;

  } else {

    lastAddSuccessful = false;

  }
}

function isHost(player) {

  for (var i = 0; i < games.length; i++) {

    if (games[i].host == player) {

      return true;
      break;

    } else {

      return false;

    }
  }
}

function gameNumber(host) {

  if (games.length == 0) { //no games created yet

    return -1;

  }

  //loop over all games, search for host match
  for (var i = 0; i < games.length; i++) {

    if (games[i].players.includes(host)) {

      return i; //gameNumber, Permissions
      break;

    } else {

      return -1; //not found in any game

    }
  }
}

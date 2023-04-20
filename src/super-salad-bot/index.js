const Discord      = require("discord.js");
const botconfig    = require("./botconfig.json");
const bot          = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

/*
 * Bot login
 * */
bot.login(botconfig.token);

bot.on("ready", async () => {
  console.log(bot.user.username + " is online!");
  bot.user.setActivity("Rolling the dice!");
});

/*
 * Message handling
 * */
bot.on("message", async message => {

  if (message.author.bot) return; //  prevent feedbacks

  /*
   * Bot commands
   * */
  if (message.content.indexOf(botconfig.prefix) !== 0) return;

  const args = message.content.slice(botconfig.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  switch ( command ) {

    case "say":

      const sayMessage = args.join(" ");
      message.delete().catch(O_o => {});
      message.channel.send(sayMessage);

      break;

    case "roll":

    let formatted = formatRollCommand(args[0], args[1]);

    let count = parseInt(formatted.count);
    let die   = parseInt(formatted.die);
    let mod   = parseInt(args[2] ?? 0);
    let modstring = ".";

    if (mod > 0) {
      modstring = " with modifier " + mod + ".";
    }

    let result = mod;
    
    let rollString = count + "x " + " d" + die + modstring;

    let calculationString = "";

    // roll dice count times and output with delay
    if (count > 1) {

      for (let i = 1; i <= count; i++) {

        let dieRoll = roll(die);

        result += dieRoll;

        calculationString += dieRoll;

        if (i == count) {

          if (mod > 0) {
            calculationString += " + " + mod;
          }

          calculationString += " = ";

        } else {
          calculationString += " + ";
        }

      }
    } else {
      result = roll(die);
    }

    result += mod;

    const resultEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setFooter(rollString)
      .setTitle(calculationString + result)
      .setThumbnail("https://cdn.discordapp.com/attachments/792380107339202580/792418852268277790/asdasd.png");

    message.channel.send(resultEmbed);
    
    break;
    
    default: message.channel.send("Command not found...");
    break;

} 
});


function roll (typeOfDie, modifier = 0) {
  return Math.floor( Math.random() * typeOfDie) + modifier;
}

function formatRollCommand(arg0, arg1) {

  // arg0: can be either number of rolls or type of die
  // arg1: can only be type of die
 
  let count = 1;
  let die   = 0;
  let regexGetFirstNumber = /\d+/; 

  if (arg1 !== undefined) { // format: '3 d4' OR '3 4'

    count = arg0;
    die   = arg1.match(regexGetFirstNumber);

  } else { // format: '3d4' OR 'd4' OR '4'

    let string = arg0;

    let containsLetter = string.split("").some(element => {
      return isNaN(parseInt(element));
    });

    if (containsLetter) {

      count = string.match(regexGetFirstNumber);
      die   = string.replace(count, "").match(regexGetFirstNumber);

    } else {
      die = string;
    }
  }

  return {count, die};

}

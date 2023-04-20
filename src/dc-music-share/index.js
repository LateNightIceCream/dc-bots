const { Client, GatewayIntentBits, DiscordjsErrorCodes } = require('discord.js');
const botconfig           = require("./botconfig.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });

const enabledChannels = [
  '1053007072574328873',
  '1052613065897693184',
  '937039392164429915',
];

// make sure these are actually emojis
// to get a custom emoji id type '\' followed by the emoji name
// e.g. '\:thumbsup:'
const musicReactionEmojis = [
  //'<:timmiKappa:898332327300698122>',
  '<:luuv:780062216321761290>',
  '<:osmabomb:780059903992791042>',
  '<:timmiKappa:898332327300698122>',
  '<:uhm_112:780062216166703114>',
  '<:yes:909646485879148585>',
  '<:no:780062215926579201>',
  '<:hype:780062216304852992>',
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {

  if (message.author.bot) {
    return;
  }

  if (enabledChannels.indexOf(message.channelId) == -1) {
    return;
  }

  if (containsUrl(message.content)) {
    musicReactionEmojis.forEach(emoji => {
      message.react(emoji).catch((error) => {
        //if (error == DiscordjsErrorCodes.EmojiType ) {
        //  console.log('unknown emoji encountered in musicReactionEmojis');
        //} // cant find the error code
        console.log(error);
        console.log('something went wrong with a reaction');
        console.log('are your emojis valid?');
      });
    });
  }
});


/* lazyyy */
function containsUrl(string) {
  if ( new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(string) ) {
        return true;
  }
  return false;
}

console.log(botconfig.token)
client.login(botconfig.token);

let fs = require("fs")

function SingleWriteChannel (channelId, bot, exceptionRoleIds = [], approvedRoleIds = []) {
    this.channelId           = channelId;
    this.exceptionRoleIds    = exceptionRoleIds;
    this.approvedRoleIds     = approvedRoleIds;
    this.bot                 = bot;
    this.messageAuthorCache  = [];
}

SingleWriteChannel.prototype.initializeChannelMessages = function () {

    let channel = this.bot.channels.cache.get(this.channelId);

    let messages = channel.messages.fetch().then( messages => {
        this.messageAuthorCache = messages
            .filter( message => !message.deleted && !message.system )
            .map( message => message.author);
    });
}

SingleWriteChannel.prototype.userAlreadySentMessage = function (userToCheck) {
    for ( let user of this.messageAuthorCache ) {
        if (user.id == userToCheck.id) {
            return true;
        }
    }
    return false;
}

SingleWriteChannel.prototype.checkAndNotify = function (message) {

    if (message.channel.id != this.channelId) return false;

    let userRole = message.member.roles.cache.filter( role => role.name !== "@everyone").first();

    // if role == moderator
    if (this.exceptionRoleIds.includes(userRole?.id)) return false;

    let userAlreadySentMessage = this.userAlreadySentMessage (message.author);

    if ( this.messageConformsWithProfile(message) && !userAlreadySentMessage) {
        this.addUser(message.author);
        return true;
    }

    let notification = message.content + "\n\n";

    if (!userAlreadySentMessage) {
        // wrong format + not yet sent a message
        notification += "Bitte erstelle zuerst deinen Steckbrief und folge dem richtigen Format. <:melon:750838132823556167>";
    }
    else if (this.approvedRoleIds.includes(userRole?.id)) { // may not be defined bc of filter
        // already sent message + role == approved
        notification += "Du bist bereits bestätigt! <:star:750810999883431937>\nUm mit den anderen zu chatten, nutze bitte den \"**Hühnerhof**\"-Channel";
    }
    else {
        // already sent message + role == not approved
        notification += "Bitte warte auf deine Bestätigung! <:chicken:750811941269930126>\nSolltest du Probleme haben, melde dich bitte bei den Modhühnchen! (Sollte dein Steckbrief gelöscht worden sein, melde dich bitte bei den Mods)";
    }

    message.delete().catch(O_o => {});
    message.author.send(notification);

    this.logMessageDeletion(message);

    return true;
}

SingleWriteChannel.prototype.messageConformsWithProfile = function (message) {
    return message.content.toLowerCase().includes("nick");
}

SingleWriteChannel.prototype.addUser = function (user) {
    this.messageAuthorCache.push(user);
}

SingleWriteChannel.prototype.logMessageDeletion = function (message) {

    let log = message.content + "\n=============================\n\n";

    fs.appendFile("deletionLog.txt", log, err => {
        if (err) console.log(err);
        console.log("Logged a deletion");
    });
}

/*----------------------------*/
module.exports = {SingleWriteChannel};

const builder = require("botbuilder");

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector, [
    session => {
        // session.send("hello! %s", session.message.text);
        session.send("欢迎来到观影体验");
        session.beginDialog('reservation', session.dialogData.reservation);
    },
    (session, results) => {
        session.dialogData.reservation = results.response;
        session.send(`您好，${session.dialogData.reservation.userName}, 已成功为您预订了 ${session.dialogData.reservation.time} 的 ${session.dialogData.reservation.peopleNum}人 包间`);
    }
])

bot.dialog('reservation', [
    (session, args) => {
        session.dialogData.reservation = args || {};
        builder.Prompts.time(session, "您需要什么时候预定？");
    },
    (session, results) =>{
        session.dialogData.reservation.time = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "您需要预定几人的包间？");
    },
    (session, results, next) => {
        session.dialogData.reservation.peopleNum = results.response;
        if(!session.dialogData.reservation.userName){
            builder.Prompts.text(session, "请问怎么称呼您？");
        } else{
            next();
        }
    },
    (session, results) => {
        if(results.response){
            session.dialogData.reservation.userName = results.response;
        }
        session.endDialogWithResult({response:session.dialogData.reservation});
    }

]);


module.exports = connector;
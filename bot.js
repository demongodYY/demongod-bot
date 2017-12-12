const builder = require("botbuilder");

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector, [
    session => {
        // session.send("hello! %s", session.message.text);
        session.send("welcome");
        session.beginDialog('reservation', session.dialogData.reservation);
    },
    (session, results) => {
        session.dialogData.reservation = results.response;
        session.send(`hello，${session.dialogData.reservation.userName}, booking ${session.dialogData.reservation.time} 的 ${session.dialogData.reservation.peopleNum}`);
    }
])

bot.dialog('reservation', [
    (session, args) => {
        session.dialogData.reservation = args || {};
        builder.Prompts.time(session, "shen？");
    },
    (session, results) =>{
        session.dialogData.reservation.time = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.choice(session, "how many","1|2|3|4|5|6",{listStyle: 3});
    },
    (session, results, next) => {
        session.dialogData.reservation.peopleNum = results.response;
        if(!session.dialogData.reservation.userName){
            builder.Prompts.text(session, "how call you");
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
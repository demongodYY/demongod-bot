const builder = require("botbuilder");

const connector = new builder.ChatConnector();
const bot = new builder.UniversalBot(connector, [
    session => {
        // session.send("hello! %s", session.message.text);
        session.send("欢迎来到观影体验");
        builder.Prompts.time(session, "您需要什么时候预定？");
    },
    (session, results) =>{
        session.dialogData.reservationTime = builder.EntityRecognizer.resolveTime([results.response]);
        builder.Prompts.text(session, "您需要预定几人的包间？");
    },
    (session, results) => {
        session.dialogData.peopleNum = results.response;
        builder.Prompts.text(session, "请问怎么称呼您？");
    },
    (session, results) => {
        session.dialogData.userName = results.response;
        session.send(`您好，${session.dialogData.userName}, 已成功为您预订了 ${session.dialogData.reservationTime} 的 ${session.dialogData.peopleNum}人 包间`);
        session.endDialog();
    }
])

// bot.dialog('test', [
//     (session) => {
//         builder.Prompt.text(session, 'TEST!!!');
//     },
//     (session, results) => {
//         session.endDialog(`hello!${results.response}`);
//     }


// ]);


module.exports = connector;
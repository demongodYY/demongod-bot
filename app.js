const builder = require("botbuilder");
const restify = require("restify");

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3999, () => {
    console.log('%s listening to %s', server.name, server.url);
});

const connector = new builder.ChatConnector();

server.post('/api/messages', connector.listen());

const bot = new builder.UniversalBot(connector, session => {
    session.send("hello! %s", session.message.text);
})
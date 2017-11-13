const restify = require("restify");
const connector = require("./bot");

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3999, () => {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());

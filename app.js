const fs = require('fs');
const zlib = require('zlib');
// Конфигурация приложения
const config = require('./config');
// HTTP маршруты
const routes = require('./api/routes');

// "Класс" - обертка koa
const Server = require('./lib/sport-data-server').SportDataServer;

// Создаем и запускаем новый сервер
const server = new Server(config, routes);
server.start().then(function() {
    console.log('started');
}).catch(function(error) {
    console.error(error);
    console.error(error.stack);
});

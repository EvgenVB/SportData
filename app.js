// Конфигурация приложения
var config = require('./config/app');
config.db.models = require('./.sequelizerc')['models-path'];

// HTTP маршруты
var routes = require('./api');

// "Класс" - обертка koa
var Server = require('./server');

// Создаем и запускаем новый сервер
var server = new Server(config, routes);
server.start().then(function() {
    console.log('started');
}).catch(function(error) {
    console.error(error);
    console.error(error.stack);
});

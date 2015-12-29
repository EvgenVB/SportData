var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");

// Создает подключение к базе данных, загружает sequelize модели и связи, возвращает функцию-генератор для Koa
// которая передает ссылку на подключение и загруженные модели в контекст koa, для доступа из контроллеров
module.exports = function (config) {
    // создается подключение к базе данных
    var db = {};
    var sequelize = new Sequelize(config.database, config.username, config.password, config);
    // читаем один раз и импортируем модели данных при подключении как middleware
    fs
        .readdirSync(config.models)
        .forEach(function(file) {
            var model = sequelize.import(path.join(config.models, file));
            db[model.name] = model;
        });
    // описываем связи моделей
    Object.keys(db).forEach(function(modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    // возвращаем генератор в текущем замкнутом контексте
    return function *(next) {
        if (!this.hasOwnProperty('db')) {
            this.db = db;
        }
        yield next;
    }

};
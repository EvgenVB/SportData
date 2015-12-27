var path = require('path');
const mode = 'development';
var configuration = {
    development: {
        session: {
            keys: ['very secret session key']
        },
        http: {
            port: 3000,
            staticPath: path.resolve(__dirname, '../public')
        },
        jade: {
            viewPath: path.resolve(__dirname, '../views'),
            // Выдает форматированный HTML и отладку компиляции шаблонов
            debug: true,
            // Отключаем кеширование, чтобы не болталось под ногами во время разработки.
            noCache: true
        },
        db: require('./sequelize.json')[mode]
    }
};

module.exports = configuration[mode];

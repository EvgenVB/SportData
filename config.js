const path = require('path');

const configuration = {
    development: {
        session: {
            keys: ['very secret session key']
        },
        http: {
            port: 3000
        },
        jade: {
            viewPath: path.resolve(__dirname, 'views'),
            // Выдает форматированный HTML и отладку компиляции шаблонов
            debug: true,
            // Отключаем кеширование, чтобы не болталось под ногами во время разработки.
            noCache: true
        }
    }
};
console.log( path.resolve(__dirname, 'views'));
module.exports = configuration.development;
// Ну а по нормальному конечно как-то так:
/***************************************
var config = 'development';
if (process.env.NODE_ENV) {
   if (configuration.hasOwnProperty(process.env.NODE_ENV)) {
       config = process.env.NODE_ENV;
   }
}

module.exports = configuration[config];
*/
// Можно еще добавить extend`ов по вкусу, дабы поддержать настройки по-умолчанию
// и не плодить одно и тоже во всех условиях запуска.
// Можно взять что-то типа convict и мучиться с его схемами, валидацией и JSON,
// вероятно появился уже кто-то более разумный.
// Можно запихать все в базу и оставить только настройку подключеия к ней.
// Организация конфигов - вечный холивар, если это тоже являлось некой подзадачей,
// сообщите отдельно, пожалуйста.
//
// Из опыта, самая адекватная ситуация - это когда непосредсвенно "админ" или система CI
// выставляет требования к организации конфигов и к тому, что там обязательно должно быть.

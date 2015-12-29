module.exports = [
    // ---------------------------------------------------------
    // ----------------------------------------------WEB
    // ---------------------------------------------------------

    // страница импорта данных
    {pattern: ['/','index.html'], method: 'get', generator: require('./controllers/web/import-sport-events-data-page').index},

    // ---------------------------------------------------------
    // ----------------------------------------------Controllers
    // ---------------------------------------------------------

    // запрос на импорт gz файла с записями спортивных событий
    {pattern: '/import/sport-events-data', method: 'post', generator: require('./controllers/import/import-sport-events-data').upload},
    // получение записей спортивных событий с пагинацией
    {pattern: '/sport-events', method: 'get', generator: require('./controllers/data/sport-events').list},
    // удаление определенного в процентах кол-ва записей спортивных событий из таблицы
    {pattern: '/sport-events/remove-random-data', method: 'get', generator: require('./controllers/data/sport-events').removeRandomData}
];
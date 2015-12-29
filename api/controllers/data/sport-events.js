var url = require('url');

/* удаляет указанный процент случайных записей спортивных событий
 принимает GET параметр percentage

 Не знаю насколько честно по отношению к заданию было
 делегировать определение случайного числа на процесс создания записи,
 может подразумевалось что-то другое?

 Я знаю еще о вариантах, когда определение случайной записи происходит в момент удаления:
 1. Банальный и медленный
 DELETE FROM events ORDER BY RAND() LIMIT ...

 2. Быстро выбирает id одной случайной записи
 SELECT main.id
    FROM events AS main JOIN
        (SELECT (RAND() *
            (SELECT MAX(id) FROM events)) AS id)
        AS sub
    WHERE main.id >= sub.id
    ORDER BY main.id ASC
    LIMIT 1;

   соответственно цикл на AS или хранимая процедура с циклом на DB

 */
exports.removeRandomData = function *(next) {
    //TODO: в middleware обработку ошибок
    try {//боже, храни генераторы
        //TODO: в middleware парсинг GET параметров
        var params = url.parse(this.request.url, true).query;
        var percentage = parseInt(params.percentage, 10) || 0;
        var result = yield this.db.Event.removeRandomCount(percentage);
        if (result.length > 0 && result[0].affectedRows) {
            this.body = {deleted: result[0].affectedRows};
        }
    } catch (error) {
        this.status = error.status || 500;
        this.body = 'Internal error';
        console.error(error);
        console.error(error.stack);
    }

    yield next;
};

// выводит список событий из базы, принимает GET параметры limit - записей на страницу, page - номер страницы
exports.list = function *(next) {
    //TODO: в middleware обработку ошибок
    try {
        //TODO: в middleware парсинг GET параметров
        var params = url.parse(this.request.url, true).query;
        var limit = parseInt(params.limit, 10) || 50;
        var offset = (parseInt(params.page, 10) - 1) * limit || 0;

        // TODO: закешировать бы
        // Получаем общее кол-во спортивных событий для рассчета пагинации
        var eventsCount = yield this.db.Event.count();
        //получаем список событий
        var events =  yield this.db.Event.scope([{method: ['listEvents', offset, limit]}]).findAll();
        this.body = {data: events, count: eventsCount};
    } catch (error) {
        this.status = error.status || 500;
        this.body = 'Internal error';
        console.error(error);
        console.error(error.stack);
    }
    yield next;
};
var url = require('url');

/* удаляет указанный процент случайных записей спортивных событий
 принимает GET параметр percentage
 Вызывает хранимую процедуру delete_random_events_rows(percentage)
 */

exports.removeRandomData = function *(next) {
    //TODO: в middleware обработку ошибок
    try {//боже, храни генераторы
        //TODO: в middleware парсинг GET параметров
        var params = url.parse(this.request.url, true).query;
        var percentage = parseInt(params.percentage, 10) || 0;
        var result = yield this.db.Event.removeRandomCount(percentage);
        var rows = result[0];
        console.log(rows['0'].deleted);
        if (rows['0'] && rows['0'].deleted > 0) {
            this.body = {deleted: rows['0'].deleted};
        } else {
            this.body = {deleted: 0};
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
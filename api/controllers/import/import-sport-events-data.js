'use strict';
var path = require('path');
var moment = require('moment');
// в большом приложении его следует подключить как middleware к koa
var bodyParser = require('co-busboy');
var fileParser = require('../../../lib/event-stream-parser');

// генератор - обработчик загрузки данных на сервер, принимает tar.gz архив массива JSON объектов спортивных событий
// передает его поток в интервально прерываемую задачу по импорту данных
// разбирает и загружает объекты событий в базу данных
exports.upload = function *(next) {
    var parts, part;
    var events, eventIndex, eventsCount, event, checkEvent;
    var teams, teamIndex, teamCount, team, checkTeam;
    var location, checkLocation;
    var scores, score;

    // кеши справочников конечно можно подгружать в начале сессии импорта, или вообще держать в памяти,
    // контекст использования этого приложения не виден из задачи, чтобы принять такое решение.
    // так что кеши тут локальные, на сессию импорта
    var teamsCache = {}, locationsCache = {};

    // Объект статистики для отправки состояния импорта по вебсокету
    var statistic = {
        doneCount: 0,
        insertedCount: 0
    };
    // если неподходящий формат body выходим
    if (!this.request.is('multipart/*')) {
        this.throw(400, 'Request content-type must be multipart/*');
        yield next;
    }

    try {
        // если подходящий, получаем итератор POST параметров
        parts = bodyParser(this, {
            // только .gz
            checkFile: function (fieldname, file, filename) {
                if (path.extname(filename) !== '.gz') {
                    var error = new Error('Allow .gz files only');
                    error.status = 400;
                    return error
                }
            }
        });
    } catch (error) {
        this.throw(400, error.message);
        yield next;
    }

    // перебираем POST параметры
    while (part = yield parts) {
        // ищем подходящий файл на загрузку
        if (typeof part === 'object'
            && part.constructor.name === 'FileStream') {
            // инстанцируем интервально прерываемый поточный парсер и передаем в него ссылку на поток,
            // согласно условиям задачи интервал прерывания - 10 объектов события
            var parser = new fileParser(part, 10);
            try {
                // пока в парсере не закончились данные, или не возникла ошибка
                while (null !== (events = yield parser.asyncParse.bind(parser))) {
                    // перебираем полученные объекты событий
                    for (eventIndex = 0, eventsCount = events.length; eventIndex < eventsCount; eventIndex++) {
                        event = events[eventIndex];
                        /* TODO: Здесь конечно необходима валидация объекта события, чтобы невалидные объекты не создавали записи в бд,
                         и/или транзакция, если позволяют вопросы производительности, что из задания не совсем ясно */

                        // вставляем спортивное событие с помощью INSERT IGNORE
                        checkEvent = yield this.db.Event.insertIgnore({
                            id: event.id,
                            date: moment(event.date).toDate()
                        });

                        // если событие вставилось, т.е. события с таким id в бд не было
                        if (checkEvent && checkEvent[0].affectedRows === 1) {
                            // запишем массив комманд и распарсим в массив запись о результатах встречи
                            teams = event.teams;
                            scores = event.scores.split(':');

                            // переберем команды, надеемся, что кол-во результатов встречи соответствует кол-ву команд в событии
                            // чтобы не городить сотни проверок в тестовом задании
                            for (teamIndex = 0, teamCount = teams.length; teamIndex < teamCount; teamIndex++) {
                                team = teams[teamIndex];
                                score = {value:scores[teamIndex]};
                                // получим название города команды
                                location = team.location;

                                // если за текущую сессию импорта такой город нам не встречался
                                if (!(team.location_id = locationsCache[location])) {
                                    // попробуем его получить из справочника
                                    checkLocation = yield this.db.Location.findOne({
                                        where: {caption: location}
                                    });

                                    // смотрим, нашелся-ли такой город в справочнике
                                    if (checkLocation) {
                                        // если нашелся, добавим в наш сессионный кеш
                                        locationsCache[location] = checkLocation.id;
                                    } else {
                                        // если не нашелся, то вставим его и запомним в кеше
                                        checkLocation = yield this.db.Location.insert({caption: location});
                                        locationsCache[location] = checkLocation[0].insertId;
                                    }
                                }

                                team.location_id = locationsCache[location];

                                // если такая команда нам не встречалась,за текущую сессию импорта
                                if (!teamsCache[team.id]) {
                                    // вставим ее через INSERT IGNORE и запомним в кеше
                                    checkTeam  = yield this.db.Team.insertIgnore(team);
                                    teamsCache[team.id] = true;
                                }

                                score.team_id = team.id;
                                score.event_id = event.id;
                                // вставим запись об очках команды в событии
                                yield this.db.Score.insert(score);
                            }
                            statistic.insertedCount++;
                        }
                        statistic.doneCount++;
                    }

                    this.io.users[this.session.ioSID].emit('import-progress', {state: 'PROGRESS', statistic: statistic});
                    // согласно условиям задачи, нужно прерваться на 300мс на каждые 10 обработанных записей
                    yield function(callback) {setTimeout(callback,300);}
                }
                this.status = 200;
                this.body = 'done';
                this.io.users[this.session.ioSID].emit('import-progress', {state: 'DONE', statistic: statistic});
                yield next;
            } catch (error) {
                this.io.users[this.session.ioSID].emit('import-progress', {state: 'ERROR', statistic: statistic, message: 'File parse error'});
                this.throw(422, 'File parse error');
                yield next;
            }
        }
    }

    this.throw(400, 'No import file was found in request');
    yield next;
};



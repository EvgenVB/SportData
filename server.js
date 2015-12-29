"use strict";
var http = require('http');
var koa = require('koa');
var IO = require('socket.io');
var routing = require('koa-routing');
var serve = require('koa-static');
var session = require('koa-session');
var Jade = require('koa-jade');
var logger = require('koa-log4js');
var Q = require('q');
var uuid = require('node-uuid');
var db = require('./lib/sequelize-loader');

class SportDataServer {
    constructor(config, routes) {
        var scope = this;
        this._port = config.http.port;
        this._koaApplication = koa();
        this._http = http.createServer(this._koaApplication.callback());
        this._io = new IO(this._http);
        this._running = false;

        var koaApplication = this._koaApplication;
        koaApplication.use(logger());
        // Управление HTTP сессиями(гостевыми в данном случае)
        koaApplication.keys = config.session.keys;
        koaApplication.use(session(koaApplication));
        // Создаем и подключаем шаблонизатор JADE
        var jade = new Jade(config.jade);
        koaApplication.use(jade.middleware);

        this._io.users = {};

        this._io.on('connection', function(socket) {
            socket.once('register', function(data) {
                scope._io.users[data.ioSID] = socket;
            });
        });

        // Прикрепляем ссылку на socket.io к контексту
        koaApplication.use(function *(next) {
            if (!this.session.start) {
                this.session.start = true;
                // запомним в сессию идентификатор для общения через веб-сокеты
                // его же будем отправлять клиенту
                this.session.ioSID = uuid.v1();
            }
            this.io = scope.io;
            yield next;
        });

        // Управление выдачей статичного контента
        koaApplication.use(serve(config.http.staticPath));
        // инициализация sequelize, загрузка моделей и связей
        koaApplication.use(db(config.db));
        // Диспетчер путей запросов к API
        koaApplication.use(routing(koaApplication));
        routes.forEach(function(route) {
            koaApplication.route(route.pattern)[route.method](route.generator);
        });
    }


    get io () {
        return this._io;
    }

    get isRunning () {
        return this._running;
    }

    get port () {
        return this._port;
    }

    updatePort (value) {
        this._port = value;
        if (value !== this._port) {
            return this.restart();
        } else {
            return Q.fcall(function () {
            });
        }
    }

    restart() {
        return Q.fcall(this.stop)
            .then(this.start);
    }

    stop() {
        var scope = this;
        return Q.async(scope._stop)
            .apply(scope)
            .then(function() {
                scope._running = false;
            });
    }

    start() {
        var scope = this;
        return Q.async(scope._start)
            .apply(scope)
            .then(function() {
                scope._running = true;
            });
    }

    *_start() {
        yield this._http.listen(this._port);
    }

    *_stop() {
        yield this._http.close();
    }
}

module.exports = SportDataServer;
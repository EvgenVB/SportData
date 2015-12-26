"use strict";
var http = require('http');
var koa = require('koa');
var routing = require('koa-routing');
var serve = require('koa-static');
var session = require('koa-session');
var Jade = require('koa-jade');
var logger = require('koa-log4js');
var Q = require('q');

class SportDataServer {
    constructor(config, routes) {
        this._port = config.http.port;
        this._koaApplication = koa();
        this._http = http.createServer(this._koaApplication.callback());
        this._running = false;

        var koaApplication = this._koaApplication;
        koaApplication.use(logger());
        // Управление HTTP сессиями(гостевыми в данном случае)
        koaApplication.keys = config.session.keys;
        koaApplication.use(session(koaApplication));
        // Создаем и подключаем шаблонизатор JADE
        var jade = new Jade(config.jade);
        koaApplication.use(jade.middleware);
        // Управление выдачей статичного контента
        koaApplication.use(serve('static'));
        // Диспетчер путей запросов к API
        koaApplication.use(routing(koaApplication));

        routes.forEach(function(route) {
            koaApplication.route(route.pattern)[route.method](route.generator);
        });
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
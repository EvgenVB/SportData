'use strict';
var zlib = require('zlib');
var JSONStream = require('JSONStream');

class SportDataEventsStreamParser {
    constructor(stream, limit) {
        this._stream = stream;
        this._limit = limit;

        this._state = 'CREATED';
        this._counter = 0;
        this._objects = [];
        this._gunzip = zlib.createGunzip();
        this._jsonStream = JSONStream.parse('*');
    }

    get state() {
        return this._state;
    }

    _dataHandler(object) {
        this._objects.push(object);
        this._counter++;
        if (this._counter == this._limit) {
            this._jsonStream.pause();
            this._state = 'PAUSED';
            this._currentCallback(null, this._objects);
        }
    }

    _dataEndHandler() {
        this._state = 'ENDED';
        if (this._objects.length > 0) {
            this._currentCallback(null, this._objects);
        } else {
            this._currentCallback(null, null);
        }
    }

    _errorHandler(error) {
        this._state = 'ERROR';
        this._currentCallback(error, null);
    }

    asyncParse(callback) {
        this._currentCallback = callback;
        if (this._state === 'CREATED') {
            this._stream
                .pipe(this._gunzip)
                .on('error', this._errorHandler.bind(this))
                .pipe(this._jsonStream)
                .on('data', this._dataHandler.bind(this))
                .on('end', this._dataEndHandler.bind(this))
                .on('error', this._errorHandler.bind(this));
            this._state = 'DRAIN';
        } else if (this._state === 'PAUSED') {
            this._counter = 0;
            this._objects = [];
            this._state = 'DRAIN';
            this._jsonStream.resume();
        }
    }
}

module.exports = SportDataEventsStreamParser;
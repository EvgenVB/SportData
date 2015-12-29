exports.index = function *(next) {
    this.render('import-sport-events-data/index', {ioSID: this.session.ioSID}, true);
    yield next;
};
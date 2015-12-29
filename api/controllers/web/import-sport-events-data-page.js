exports.index = function *(next) {
    this.render('import-data/index', {ioSID: this.session.ioSID}, true);
    yield next;
};
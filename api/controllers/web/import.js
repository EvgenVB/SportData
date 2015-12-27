exports.index = function *(next) {
    this.render('import-data/index', {}, true);
    yield next;
};
exports.index = function *() {
    console.log(this.logger);
    this.render('import-data/index', {}, true);
};
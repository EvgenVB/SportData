module.exports = [
    // WEB
    {pattern: ['/','index.html'], method: 'get', generator: require('../controllers/web/import').index}
];
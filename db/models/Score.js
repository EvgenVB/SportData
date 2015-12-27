'use strict';
module.exports = function(sequelize, DataTypes) {
    var Score = sequelize.define('Score', {
        value: DataTypes.INTEGER
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'scores'
    });
    return Score;
};
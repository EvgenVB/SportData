'use strict';
module.exports = function(sequelize, DataTypes) {
    var Score = sequelize.define('Score', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        value: DataTypes.INTEGER,
        team_id: DataTypes.INTEGER,
        event_id: DataTypes.INTEGER
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'scores',
        classMethods: {
            associate: function(models) {
                this.belongsTo(models.Team, {as: 'team', foreignKey: 'team_id'});
            },
            insert: function(data) {
                return sequelize.query('INSERT INTO scores (value, team_id, event_id) VALUES (:value, :team_id, :event_id)', {replacements: data});
            }
        }
    });
    return Score;
};
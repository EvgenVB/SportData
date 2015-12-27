'use strict';
module.exports = function(sequelize, DataTypes) {
    var Team = sequelize.define('Team', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        caption: DataTypes.STRING
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'teams',
        classMethods: {
            associate: function(models) {
                // Foreign key для связи Города --* Команды
                this.hasOne(models.Location, {
                    foreignKey: 'location_id',
                    as: 'location',
                    constraints: true,
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE'
                });

                // Foreign key для связи Спортивные События *--* Команды
                this.belongsToMany(models.Event, {
                    through: {
                        model: models.Score,
                        as: 'score'
                    },
                    foreignKey: 'team_id',
                    as: 'events',
                    constraints: true,
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE'
                });
            }
        }
    });
    return Team;
};
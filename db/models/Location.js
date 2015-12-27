'use strict';
module.exports = function(sequelize, DataTypes) {
    var Location = sequelize.define('Location', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        caption: DataTypes.STRING
    }, {
        timestamps: false,
        tableName: 'locations',
        classMethods: {
            associate: function(models) {
                // Foreign key для связи Города --* Команды
                this.hasMany(models.Team, {
                    foreignKey: 'location_id',
                    as: 'teams',
                    constraints: true,
                    onDelete: 'SET NULL',
                    onUpdate: 'CASCADE'
                })
            }
        }
    });
    return Location;
};
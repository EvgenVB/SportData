'use strict';
module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        date: DataTypes.DATE,
        randomValue: {type: DataTypes.BIGINT, field: 'random_values', allowNull: false}
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'events',
        classMethods: {
            associate: function(models) {
                // Foreign key для связи Спортивные События *--* Команды
                this.belongsToMany(models.Team, {
                    through: {
                      model: models.Score,
                      as: 'score'
                    },
                    foreignKey: 'event_id',
                    as: 'teams',
                    constraints: true,
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                })
            }
        },
        hooks: {
            beforeCreate: function(event, options) {
                event.randomValue = getRandomIntegerValue();
            },
            beforeBulkCreate: function(records) {
                for (var i = 0, c = records.length; i < c; i++) {
                    records[i].randomValue = getRandomIntegerValue();
                }
            }
        },
        scopes: {
            listEvents: function(offset, limit) {
                return {
                    attributes: ['id', 'date'],
                    offset: offset,
                    limit: limit,
                    include: [{
                        model: sequelize.models.Team,
                        as: 'teams',
                        attributes: ['caption'],
                        through: {
                            model: sequelize.models.Score,
                            as: 'score',
                            attributes: ['value']
                        },
                        include: [{model: models.Location, as: 'location', attributes: ['caption']}]
                    }]
                }
            }
        }
    });
    return Event;
};

function getRandomIntegerValue() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
}
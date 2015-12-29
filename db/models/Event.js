'use strict';
module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        date: DataTypes.DATE,
        randomValue: {
            type: DataTypes.BIGINT,
            field: 'random_value'}
    }, {
        timestamps: false,
        underscored: true,
        tableName: 'events',
        classMethods: {
            associate: function(models) {
                /* Foreign key для связи Спортивные События *--* Команды

                Могло бы им стать, если бы sequelize не склеивал неуникальные записи through таблицы
                  поэтому придется вручную: События --* Очки *-- Команды.

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
                })*/

                this.hasMany(models.Score, {as: 'scores', foreignKey: 'event_id'});
            },
            insertIgnore: function(data) {
                data.random_value = getRandomIntegerValue();
                return sequelize.query('INSERT IGNORE INTO events (id, date, random_value) VALUES (:id, :date, :random_value)', {replacements: data});
            },
            removeRandomCount: function *(percentage) {
                // Можно и быстрее, но не похоже, что эту функцию могут использовать сколько-то раз в секунду
                var count = yield this.count();
                // sequelize не желает в метод delete принимать order
                return yield sequelize.query('DELETE FROM `events` ORDER BY random_value LIMIT ?', {replacements: [Math.floor(count*(percentage/100))]});
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
                        model: sequelize.models.Score,
                        as: 'scores',
                        attributes: ['value'],
                        include: [{
                            model: sequelize.models.Team,
                            as: 'team',
                            attributes: ['caption'],
                            include: [{model: sequelize.models.Location, as: 'location', attributes: ['caption']}]
                        }]
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
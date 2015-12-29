'use strict';
module.exports = function(sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
        id: {type: DataTypes.INTEGER, primaryKey: true},
        date: DataTypes.DATE
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
                return sequelize.query('INSERT IGNORE INTO events (id, date) VALUES (:id, :date)', {replacements: data});
            },
            removeRandomCount: function *(percentage) {
                return yield sequelize.query('CALL `delete_random_events_rows`(?)', {replacements: [percentage], type: sequelize.QueryTypes.SELECT});
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
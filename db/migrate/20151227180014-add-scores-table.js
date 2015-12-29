'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('scores', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: Sequelize.INTEGER
            },
            team_id: {
                type: Sequelize.INTEGER,
                references: 'teams',
                referencesKey: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            event_id: {
                type: Sequelize.INTEGER,
                references: 'events',
                referencesKey: 'id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        }, {
            timestamps: false,
            comment: 'Таблица результатов спортивных событий'
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('scores');
    }
};

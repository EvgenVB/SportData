'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('scores', {
            value: {
                type: Sequelize.INTEGER
            },
            team_id: {
                type: Sequelize.INTEGER
            },
            event_id: {
                type: Sequelize.INTEGER
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

'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('events', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            date: {
                type: Sequelize.DATE
            },
            random_value: {
                type: Sequelize.BIGINT,
                allowNull: false
            }
        }, {
            timestamps: false
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('events');
    }
};

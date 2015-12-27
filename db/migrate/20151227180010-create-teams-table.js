'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('teams', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            caption: {
                type: Sequelize.STRING(255)
            },
            location_id: {
                type: Sequelize.INTEGER
            }
        }, {
            timestamps: false,
            underscored: true,
            comment: "Таблица спортивных команд"
        });
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('teams');
    }
};

'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('locations', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            caption: {
                type: Sequelize.STRING(255)
            }
        }, {
            timestamps: false,
            comment: "Справочник городов"
        });
    },

    down: function (queryInterface, Sequelize) {
         return queryInterface.dropTable('locations');
    }
};

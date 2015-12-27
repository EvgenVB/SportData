'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addIndex('events',
            ['random_value'],
            {
                indexName: 'idx_events_random_value'
            });
    },

    down: function (queryInterface, Sequelize) {
         return queryInterface.removeIndex('locations', 'idx_events_random_value');
    }
};

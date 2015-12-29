'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.removeColumn('events', 'random_value');
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.addColumn(
            'events',
            'random_value',
            Sequelize.INTEGER
        ).then({function() {
            return queryInterface.addIndex('events',
                ['random_value'],
                {
                    indexName: 'idx_events_random_value'
                })
        }});
    }
};

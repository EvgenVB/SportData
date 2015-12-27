'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.addIndex('locations',
            ['caption'],
            {
                indexName: 'idx_locations_caption',
                indicesType: 'UNIQUE',
                indexType: 'HASH'
            });
    },

    down: function (queryInterface, Sequelize) {
         return queryInterface.removeIndex('locations', 'idx_locations_caption');
    }
};

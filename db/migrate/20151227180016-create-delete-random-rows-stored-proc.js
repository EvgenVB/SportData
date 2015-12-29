'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.sequelize.query(
            'CREATE PROCEDURE `delete_random_events_rows`(IN percentage FLOAT) '+
            'BEGIN '+
            'DECLARE events_count INT(4); '+
            'DECLARE deleted INT(4); '+
            'DECLARE tmp_id INT(4); '+
            'SELECT COUNT(id) INTO events_count FROM events; '+
            'SET events_count = ROUND(events_count*percentage/100); '+
            'SET deleted = 0; '+
            'main_loop: LOOP '+
            '	IF events_count < 1 THEN '+
            '		LEAVE main_loop; '+
            '	END IF; '+
            '	SELECT main.id INTO tmp_id '+
            '		FROM events AS main JOIN '+
            '			(SELECT (RAND() * '+
            '				(SELECT MAX(id) FROM events)) AS id) '+
            '			AS sub '+
            '		WHERE main.id >= sub.id '+
            '		ORDER BY main.id ASC '+
            '		LIMIT 1; '+
            '    DELETE FROM `events` WHERE id = tmp_id; '+
            '	SET events_count = events_count - 1; '+
            '    SET deleted = deleted + 1; '+
            'END LOOP main_loop; '+
            'SELECT deleted; '+
            'END'
            ,{type: queryInterface.sequelize.QueryTypes.RAW});
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.queryInterface.sequelize.query('DROP PROCEDURE `delete_random_events_rows`;');
    }
};



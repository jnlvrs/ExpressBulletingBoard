'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Deleted" to table "posts"
 * addColumn "Deleted" to table "users"
 *
 **/

var info = {
    "revision": 2,
    "name": "deleted_update_migration",
    "created": "2021-09-28T16:36:35.647Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "posts",
            "Deleted",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Deleted"
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "users",
            "Deleted",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Deleted"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};

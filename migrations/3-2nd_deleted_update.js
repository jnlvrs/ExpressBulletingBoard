'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "Deleted" on table "posts"
 * changeColumn "Deleted" on table "users"
 *
 **/

var info = {
    "revision": 3,
    "name": "2nd_deleted_update",
    "created": "2021-09-29T19:06:26.833Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "posts",
            "Deleted",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Deleted",
                "default": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "users",
            "Deleted",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Deleted",
                "default": false
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

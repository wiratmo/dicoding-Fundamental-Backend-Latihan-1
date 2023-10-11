/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('notes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        title: {
            type:'text',
            notNull: true
        },
        body: {
            type:'text',
            notNull: true
        },
        tags: {
            type:'text[]',
            notNull: true
        },
        created_at: {
            type:'text',
            notNull: true
        },
        updated_at: {
            type:'text',
            notNull: true
        },
    })

};

exports.down = pgm => {
    pgm.dropTable('notes')
};

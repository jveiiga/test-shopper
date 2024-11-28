import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('drivers', (table) => {
        table.increments('id').primary();
        table.string('name', 100).notNullable();
        table.text('description');
        table.string('vehicle', 50);
        table.decimal('review_rating', 3, 2);
        table.text('review_comment');
        table.decimal('min_distance', 10, 2).notNullable();
    });

    await knex.schema.createTable('rides', (table) => {
        table.increments('id').primary();
        table.string('customer_id', 50).notNullable();
        table.string('origin').notNullable();
        table.string('destination').notNullable();
        table.decimal('distance', 10, 2).notNullable();
        table.string('duration', 50).notNullable();
        table.integer('driver_id').unsigned().notNullable().references('id').inTable('drivers').onDelete('CASCADE');
        table.decimal('total_value', 10, 2).notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('rides');
    await knex.schema.dropTableIfExists('drivers');
}


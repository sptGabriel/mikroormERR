import { Migration } from '@mikro-orm/migrations';
export class Migration20201104231205 extends Migration {
  async up(): Promise<void> {
    return this.getKnex()
      .schema.hasTable('equipments')
      .then((exists) => {
        if (exists) return;
        return this.getKnex()
          .schema // **** udpate
          .createTable('equipments', async (table) => {
            table.string('patrimony_code').notNullable().primary();
            table
              .uuid('component_id')
              .references('components.id')
              .notNullable()
              .unique();
            table.timestamp('created_at').defaultTo(this.getKnex().fn.now());
            table.timestamp('updated_at').defaultTo(this.getKnex().fn.now());
            table.timestamp('deleted_at');
          });
      });
  }
  async down(): Promise<void> {
    return this.getKnex().schema.dropTable('equipments');
  }
}

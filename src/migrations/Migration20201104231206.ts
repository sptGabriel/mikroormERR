import { Migration } from '@mikro-orm/migrations';
export class Migration20201104231206 extends Migration {
  async up(): Promise<void> {
    return this.getKnex()
      .schema.hasTable('equipment_has_components')
      .then(exists => {
        if (exists) return;
        return this.getKnex()
          .schema // **** udpate
          .createTable('equipment_has_components', async table => {
            table
              .string('equipment_id')
              .references('patrimony_code')
              .inTable('equipments')
              .notNullable()
            table
              .uuid('component_id')
              .references('components.id')
              .notNullable()
              .unique();
            table.unique(['equipment_id', 'component_id']);
            table.timestamp('created_at').defaultTo(this.getKnex().fn.now());
            table.timestamp('updated_at').defaultTo(this.getKnex().fn.now());
            table.timestamp('deleted_at');
          });
      });
  }
  async down(): Promise<void> {
    return this.getKnex().schema.dropTable('equipment_has_components');
  }
}

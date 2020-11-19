import { Migration } from '@mikro-orm/migrations';

export class Migration20201102135859 extends Migration {
  async up(): Promise<void> {
    return this.getKnex()
      .schema.hasTable('products')
      .then(exists => {
        if (exists) return;
        return this.getKnex()
          .schema // **** udpate
          .createTable('products', async table => {
            table.uuid('id').notNullable().primary();
            table.string('name', 100).notNullable();
            table.string('cod_reference', 100).notNullable();
            table
              .uuid('category_id')
              .notNullable()
              .references('product_categories.id')
              .onUpdate('CASCADE') // if Article primary key is changed, update this foreign key.
              .onDelete('NO ACTION');
            table.double('current_price').notNullable().defaultTo(0);  
            table.boolean('has_instances').notNullable().defaultTo(false)
            table.timestamp('created_at').defaultTo(this.getKnex().fn.now());
            table.timestamp('updated_at').defaultTo(this.getKnex().fn.now());
            table.timestamp('deleted_at');
          });
      });
  }
  async down(): Promise<void> {
    return this.getKnex().schema.dropTable('products');
  }
}

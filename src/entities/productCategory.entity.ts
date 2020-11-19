import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4, validate } from 'uuid';
import { Product } from './product.entity';
interface categoryContainer {
  id?: string;
  name: string;
  parent?: ProductCategory | null;
}
@Entity({ tableName: 'product_categories' })
export class ProductCategory {
  @PrimaryKey()
  public readonly id: string;
  @ManyToOne(() => ProductCategory, {
    nullable: true,
    fieldName: 'parent_id',
  })
  public parent!: ProductCategory;
  @Property()
  public name: string;
  @OneToMany(() => Product, product => product.category)
  public products = new Collection<Product>(this);
  @OneToMany({
    entity: () => ProductCategory,
    mappedBy: 'parent',
    orphanRemoval: true,
  })
  public parents = new Collection<ProductCategory>(this);
  @Property()
  public created_at = new Date();
  @Property({ onUpdate: () => new Date() })
  public updated_at = new Date();
  @Property()
  public deleted_at?: Date;

  constructor(container: categoryContainer) {
    this.id = container.id ? container.id : v4();
    this.name = container.name;
    if (container.parent) this.parent = container.parent;
  }

  static build = ({ id, name, parent }: categoryContainer): ProductCategory => {
    const isValidUUID = id ? validate(id) : null;
    if (isValidUUID === false) throw new Error(`Invalid UUID V4`);
    return new ProductCategory({ id, name, parent });
  };

  toJSON = () => {
    return {
      id: this.id,
      name: this.name,
      parent_id: this.parent ? this.parent.id : null,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at,
    };
  };
}

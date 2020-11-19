import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4, validate } from 'uuid';
import { ProductCategory } from './productCategory.entity';
interface productContainer {
  id?: string;
  name: string;
  cod_reference: string;
  category: ProductCategory;
  has_instances: boolean;
  current_price: number;
}
@Entity({ tableName: 'products' })
export class Product {
  @PrimaryKey()
  public readonly id: string;
  @Property()
  public name: string;
  @Property()
  public cod_reference: string;
  @Property({ default: false })
  public has_instances: boolean;
  @Property({ default: 0 })
  public current_price: number;
  @ManyToOne({ entity: () => ProductCategory, fieldName: 'category_id' })
  public category!: ProductCategory;
  @Property()
  public created_at = new Date();
  @Property({ onUpdate: () => new Date() })
  public updated_at = new Date();
  @Property({ default: null })
  public deleted_at?: Date;
  constructor(container: productContainer) {
    this.id = container.id ? container.id : v4();
    this.cod_reference = container.cod_reference;
    this.category = container.category;
    this.name = container.name;
    this.has_instances = container.has_instances;
    this.current_price = container.current_price;
  }
  static build = ({
    id,
    category,
    cod_reference,
    name,
    has_instances,
    current_price,
  }: productContainer): Product => {
    if (id && !validate(id)) throw new Error(`invalid uuid`);
    return new Product({
      id,
      category,
      cod_reference,
      name,
      has_instances,
      current_price,
    });
  };

  // public toJSON = () => {
  //   return {
  //     id:this.id,
  //     cod_reference:this.cod_reference,
  //     name:this.name,
  //     category_id: this.category_id,
  //     has_instances:this.has_instances,
  //     created_at:this.created_at,
  //     updated_at:this.updated_at,
  //     deleted_at:this.deleted_at ? this.deleted_at : null
  //   }
  // }
  // @OneToOne(() => ProductStocks, stock => stock.product, {
  //   mappedBy: 'product',
  //   serializer: value => value.quatity,
  //   serializedName: 'quantity',
  // })
  // public stock: ProductStocks;
}

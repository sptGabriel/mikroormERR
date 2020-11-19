import {
  Collection,
  Entity,
  Filter,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { EquipmentHasComponents } from './equipamentHasComponents.entity';
import { EquipmentInstance } from './equipment.entity';
import { v4 } from 'uuid';
import { Product } from './product.entity';
interface instanceContainer {
  id?: string;
  serial_number: string;
  product: Product;
}
@Filter({
  name: 'componentIsEquipment',
  cond: (args) => ({ equipament: { id: { $nin: args.ids } } }),
})
@Entity({ tableName: 'components' })
export class ComponentInstance {
  @PrimaryKey()
  public readonly id: string;
  @Unique({ name: 'component' })
  @Property()
  public readonly serial_number: string;
  @ManyToOne(() => Product, { fieldName: 'product_id' })
  public product!: Product;
  @OneToOne({
    entity: () => EquipmentInstance,
    mappedBy: 'component',
    strategy: LoadStrategy.JOINED,
  })
  public equipment: EquipmentInstance;
  @OneToMany(() => EquipmentHasComponents, (comp) => comp.component, {
    strategy: LoadStrategy.JOINED,
  })
  public equipments = new Collection<EquipmentHasComponents>(this);
  @Property()
  public created_at = new Date();
  @Property({ onUpdate: () => new Date() })
  public updated_at = new Date();
  @Property()
  public deleted_at?: Date;

  constructor(container: instanceContainer) {
    this.id = container.id ? container.id : v4();
    this.serial_number = container.serial_number;
    this.product = container.product;
  }

  static build = (container: instanceContainer): ComponentInstance => {
    return new ComponentInstance(container);
  };
}

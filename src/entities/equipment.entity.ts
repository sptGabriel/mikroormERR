import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ComponentInstance } from './componentInstance.entity';
import { validate } from 'uuid';
import { EquipmentHasComponents } from './equipamentHasComponents.entity';
export interface EquipmentProps {
  id?: string;
  patrimony_code: string;
  component: ComponentInstance;
}
@Entity({ tableName: 'equipments' })
export class EquipmentInstance {
  @PrimaryKey()
  public patrimony_code: string;
  @Unique()
  @OneToOne(() => ComponentInstance, (component) => component.equipment, {
    owner: true,
    orphanRemoval: true,
    cascade: [],
    fieldName: 'component_id',
  })
  public component: ComponentInstance;
  @OneToMany(() => EquipmentHasComponents, (equips) => equips.equipment)
  public components = new Collection<EquipmentHasComponents>(this);
  @Property()
  public createdAt = new Date();
  @Property({ onUpdate: () => new Date() })
  public updatedAt = new Date();
  @Property()
  public deletedAt?: Date;

  constructor(container: EquipmentProps) {
    this.patrimony_code = container.patrimony_code;
    this.component = container.component;
  }

  static build = ({
    id,
    patrimony_code,
    component,
  }: EquipmentProps): EquipmentInstance => {
    if (id && !validate(id)) throw new Error(`Invalid UUID V4`);
    return new EquipmentInstance({
      id,
      patrimony_code,
      component,
    });
  };
}

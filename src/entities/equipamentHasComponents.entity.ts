import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { ComponentInstance } from './componentInstance.entity';
import { EquipmentInstance } from './equipment.entity';

@Entity({ tableName: 'equipment_has_components' })
export class EquipmentHasComponents {
  @ManyToOne({
    entity: () => EquipmentInstance,
    fieldName: 'equipment_id',
    primary: true,
  })
  public equipment!: EquipmentInstance;
  @ManyToOne({
    entity: () => ComponentInstance,
    fieldName: 'component_id',
    primary: true,
  })
  public component!: ComponentInstance;
  [PrimaryKeyType]: [EquipmentInstance, ComponentInstance];
  @Property()
  public createdAt = new Date();
  @Property({ onUpdate: () => new Date() })
  public updatedAt = new Date();
  @Property()
  public deletedAt?: Date;
  constructor(equipment: EquipmentInstance, component: ComponentInstance) {
    this.equipment = equipment;
    this.component = component;
  }
  static build = (
    equipment: EquipmentInstance,
    component: ComponentInstance
  ): EquipmentHasComponents => {
    return new EquipmentHasComponents(equipment, component);
  };
}

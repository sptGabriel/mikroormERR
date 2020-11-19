import { RequestContext } from '@mikro-orm/core';
import { ComponentInstance } from 'entities/componentInstance.entity';
import { EquipmentHasComponents } from 'entities/equipamentHasComponents.entity';
import { EquipmentInstance } from 'entities/equipment.entity';
import { Router, Request, Response } from 'express';

const create = async (
  instance: EquipmentInstance
): Promise<EquipmentInstance> => {
  const em = RequestContext.getEntityManager();
  if (!em) throw new Error('em dont work');
  if (!(instance instanceof EquipmentInstance))
    throw new Error(`Invalid Data Type`);
  await em.persist(instance).flush();
  return instance;
};

const getComponents = async (
  sn_keys: string[]
): Promise<ComponentInstance[]> => {
  const em = RequestContext.getEntityManager();
  if (!em) throw new Error('em dont work');
  return await em.find(
    ComponentInstance,
    {
      $or: [
        { serial_number: sn_keys },
        { equipment: { component: { serial_number: sn_keys } } },
        { equipments: { component: { serial_number: sn_keys } } },
      ],
    },
    ['equipment', 'equipments']
  );
};
const bySn = async (sn: string): Promise<ComponentInstance | undefined> => {
  const em = RequestContext.getEntityManager();
  if (!em) throw new Error('em dont work');
  const instance = await em.findOne(
    ComponentInstance,
    {
      serial_number: sn,
    },
    ['equipment', 'equipments']
  );
  if (!instance) return;
  return instance;
};

const valideteComponent = async (component_sn: string) => {
  const component = await bySn(component_sn);
  if (!component) throw new Error(`This component product doesn't exists`);
  if (component.equipment || component.equipments.length) {
    throw new Error(`Component is part or an equipment`);
  }
  return component;
};
const validateComponents = async (components: string[] | undefined) => {
  if (!components || components.length < 1) return null;
  const hasComponents = await getComponents(components);
  if (hasComponents.length !== components.length) {
    throw new Error(`Components doesn't exists.`);
  }
  let compIsPartorEquip: string[] = [];
  for (let component of hasComponents) {
    if (component.equipment) compIsPartorEquip.push(component.id);
    for (let comp of component.equipments) {
      if (comp.component) compIsPartorEquip.push(comp.component.id);
    }
  }
  if (compIsPartorEquip.length > 0) {
    throw new Error(
      `This components is equipments or part of equipments: ${compIsPartorEquip}`
    );
  }
  return hasComponents;
};

const test = Router();
test.post('/', async (request: Request, response) => {
  try {
    console.log('a');
    const componentOwner = await valideteComponent('x4');
    const hasAllComponents = await validateComponents(['x', 'xx']);
    const equipDomain = EquipmentInstance.build({
      component: componentOwner,
      patrimony_code: request.body.patrimony_code,
    });
    if (hasAllComponents && hasAllComponents.length > 0) {
      equipDomain.components.set(
        hasAllComponents.map((component) => {
          return EquipmentHasComponents.build(equipDomain, component);
        })
      );
    }
    const equipment = create(equipDomain);
    response.status(200).json(equipment);
  } catch (error) {
    response.status(400).json(error.message);
  }
});
export default { test };

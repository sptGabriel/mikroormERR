import { MikroORM, RequestContext } from '@mikro-orm/core';
import { ComponentInstance } from 'entities/componentInstance.entity';
import { Product } from 'entities/product.entity';
import { ProductCategory } from 'entities/productCategory.entity';
import options from 'mikro.config';
const Category = ProductCategory.build({
  id: 'dd97f4b1-8dbe-47fb-aac1-18c58434747e',
  name: 'a',
});
const ProductOne = Product.build({
  id: '31ec4f27-6753-42ba-a4d0-728ca0aa52f2',
  category: Category,
  cod_reference: 'f',
  current_price: 500,
  has_instances: true,
  name: 'aa',
});
const ProductTwo = Product.build({
  id: 'e0523cf3-e75c-441d-a87b-65c11c7bf4c8',
  category: Category,
  cod_reference: '1',
  current_price: 500,
  has_instances: true,
  name: 'aa',
});
const ProductThree = Product.build({
  id: 'e28ee5e5-20d0-4291-b7f4-a438a34eec61',
  category: Category,
  cod_reference: '2',
  current_price: 500,
  has_instances: true,
  name: 'aa',
});
const Component = ComponentInstance.build({
  id: 'c20570f1-d1c3-4a4a-af92-60fd2a283462',
  product: ProductOne,
  serial_number: 'xd',
});
const ComponentTwo = ComponentInstance.build({
  id: '7137c284-e22f-4cf3-8aa7-1b1394df4f81',
  product: ProductTwo,
  serial_number: 'x',
});
const ComponentThree = ComponentInstance.build({
  id: 'aa40a86e-c882-425b-b0aa-4432f32275fc',
  product: ProductThree,
  serial_number: 'xx',
});
export const populate = async () => {
  try {
    const connection = await MikroORM.init(options);
    if (!connection) throw new Error(``);
    await connection.em
      .fork()
      .persistAndFlush([
        Category,
        ProductOne,
        ProductTwo,
        ProductThree,
        Component,
        ComponentTwo,
        ComponentThree,
      ]);
  } catch (error) {
    console.log(error);
  }
};

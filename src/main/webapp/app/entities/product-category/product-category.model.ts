import { IProduct } from 'app/entities/product/product.model';

export interface IProductCategory {
  id?: number;
  name?: string;
  description?: string | null;
  products?: IProduct[] | null;
}

export class ProductCategory implements IProductCategory {
  constructor(public id?: number, public name?: string, public description?: string | null, public products?: IProduct[] | null) {}
}

export function getProductCategoryIdentifier(productCategory: IProductCategory): number | undefined {
  return productCategory.id;
}

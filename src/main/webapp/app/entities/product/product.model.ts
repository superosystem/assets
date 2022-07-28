import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { SizeProduct } from 'app/entities/enumerations/size-product.model';

export interface IProduct {
  id?: number;
  name?: string;
  description?: string | null;
  price?: number;
  sizeProduct?: SizeProduct;
  imageContentType?: string | null;
  image?: string | null;
  productCategory?: IProductCategory | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string | null,
    public price?: number,
    public sizeProduct?: SizeProduct,
    public imageContentType?: string | null,
    public image?: string | null,
    public productCategory?: IProductCategory | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}

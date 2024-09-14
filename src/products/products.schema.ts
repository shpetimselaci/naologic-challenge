import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Product {
  @Prop({ type: String, unique: true })
  _id: string;

  @Prop({ type: String })
  docId: string;

  @Prop({ type: Object })
  fullData: object;

  @Prop({ type: Object })
  data: {
    name: string;
    type: string;
    shortDescription: string;
    description: string;
    vendorId: string;
    manufacturerId: string;
    storefrontPriceVisibility: string;
    variants: {
      id: string;
      available: boolean;
      attributes: {
        packaging: string;
        description: string;
      };
      cost: number;
      currency: string;
      depth: number;
      description: string;
      dimensionUom: string;
      height: number;
      width: number;
      manufacturerItemCode: string;
      manufacturerItemId: string;
      packaging: string;
      price: number;
      volume: number;
      volumeUom: string;
      weight: number;
      weightUom: string;
      optionName: string;
      optionsPath: string;
      optionItemsPath: string;
      sku: string;
      active: boolean;
      images: {
        fileName: string;
        cdnLink: string;
        i: number;
        alt: string;
      }[];
      itemCode: string;
    }[];
    options: {
      id: string;
      name: string;
      dataField: string;
      values: {
        id: string;
        name: string;
        value: string;
      }[];
    }[];
    availability: string;
    isFragile: boolean;
    published: string;
    isTaxable: boolean;
    images: {
      fileName: string;
      cdnLink: string;
      i: number;
      alt: string;
    }[];
    categoryId: string;
  };

  @Prop({ type: Object })
  dataPublic: object;

  @Prop({ type: Boolean })
  immutable: boolean;

  @Prop({ type: String })
  deploymentId: string;

  @Prop({ type: String })
  docType: string;

  @Prop({ type: String })
  namespace: string;

  @Prop({ type: String })
  companyId: string;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Object })
  info: {
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    deletedBy: string;
    deletedAt: string;
    dataSource: string;
    companyStatus: string;
    transactionId: string;
    skipEvent: boolean;
    userRequestId: string;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export type ProductDocument = HydratedDocument<Product>;

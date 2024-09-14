import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ unique: true })
  id: string;

  @Prop()
  docId: string;

  @Prop()
  docType: string;

  @Prop()
  namespace: string;

  @Prop()
  status: string;

  @Prop({ type: Object })
  data: object;

  @Prop()
  vendorId: string;

  @Prop()
  manufacturerId: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

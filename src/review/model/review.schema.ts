import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Review {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Product' })
  product_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Customer' })
  customer_id: Types.ObjectId;

  @Prop({ default: null })
  comment: string;

  @Prop({ type: Number, min: 1, max: 5, required: true })
  point: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

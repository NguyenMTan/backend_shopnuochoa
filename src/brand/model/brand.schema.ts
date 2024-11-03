import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Brand {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ unique: true })
  name: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: null })
  description: string;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Product', required: false })
  products?: Types.ObjectId[];
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

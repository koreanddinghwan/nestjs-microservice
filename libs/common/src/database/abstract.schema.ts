import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

/**
 * @description
 * Abstract schema for all documents in the database.
 *
 *
 * */
@Schema()
export class AbstractDocument {
  @Prop({
    type: SchemaTypes.ObjectId,
  })
  _id: Types.ObjectId;
}

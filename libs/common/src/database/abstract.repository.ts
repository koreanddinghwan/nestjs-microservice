import { AbstractDocument } from '@app/common/database/abstract.schema';
import { FilterQuery, FlattenMaps, Model, Require_id, Types } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<
    TDocument extends any[]
      ? Require_id<FlattenMaps<TDocument>>[]
      : Require_id<FlattenMaps<TDocument>>
  > {
    const doc = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!doc) {
      this.logger.warn(
        `Document not found for filter query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return doc;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: Partial<TDocument>,
  ): Promise<
    TDocument extends any[]
      ? Require_id<FlattenMaps<TDocument>>[]
      : Require_id<FlattenMaps<TDocument>>
  > {
    const doc = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!doc) {
      this.logger.warn(
        `Document not found for filter query: ${JSON.stringify(filterQuery)}`,
      );
      throw new NotFoundException('Document not found');
    }

    return doc;
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>) {
    return this.model.findOneAndDelete(filterQuery, {}, { lean: true });
  }
}

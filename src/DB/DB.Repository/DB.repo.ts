import { Filter } from 'firebase-admin/firestore';
import { AnyKeys, CreateOptions, HydratedDocument, Model, MongooseUpdateQueryOptions, ProjectionType, QueryFilter, QueryOptions, Types, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";
import type { UpdateOptions as MongoUpdateOptions } from 'mongodb'



export abstract class DatabaseRepository<TRawDoc>{

    constructor(protected readonly model:Model<TRawDoc  >){}
async create({
data,
options
}:{
    data:AnyKeys<TRawDoc>[],
    options?:CreateOptions|undefined
}): Promise<HydratedDocument<TRawDoc>[]>{
    return await this.model.create(data as any, options)
}

async createOne({
data,
options
}:{
    data:AnyKeys<TRawDoc>,
    options?:CreateOptions|undefined
}): Promise<HydratedDocument<TRawDoc>>{
    const [doc] = await this.create({data: [data], options}) || []
     return doc as HydratedDocument<TRawDoc>
}

//findOne
async findOne({
filter,
projection,
options
}:{
          filter?: QueryFilter<TRawDoc>,
          projection?: ProjectionType<TRawDoc> | null | undefined,
          options?: QueryOptions<TRawDoc>  | null | undefined
}){
    return await this.model.findOne(filter, projection, options)
}

//find


//findById
async findById({
_id,
projection,
options
}:{
          _id: string | Types.ObjectId,
          projection?: ProjectionType<TRawDoc> | null | undefined,
          options?: QueryOptions<TRawDoc>  | null | undefined
}){
    return await this.model.findById(_id, projection)
}
//find

  
//update
async updateOne({
filter,
update,
options
}:{

           filter: QueryFilter<TRawDoc>,

          update: UpdateQuery<TRawDoc> | UpdateWithAggregationPipeline,
          options?: (MongoUpdateOptions & MongooseUpdateQueryOptions<TRawDoc>) | null
}){
    return await this.model.updateOne(filter, update, options)
}
async Delete({
filter
}:{
          filter?: QueryFilter<TRawDoc>,
 
}){
    return await this.model.deleteOne(filter)
}









async find({
  filter = {},
  projection,
  options
}: {
  filter?: QueryFilter<TRawDoc>,
  projection?: ProjectionType<TRawDoc>,
  options?: QueryOptions<TRawDoc>
}) {
  return this.model.find({
    ...filter
  }, projection, options);
}
async paginateTest({
filter  ,
projection,
options,
page = 1,
size = 3
}:{
          filter?: QueryFilter<TRawDoc>,
          projection?: ProjectionType<TRawDoc> ,
          options?: QueryOptions<TRawDoc> ,
          page?:number,
          size?:number
}){
    const skip = (page - 1) * size;
    const docs = await this.model.find(filter, projection, options).skip(skip).limit(size);
    const countDocs = await this.model.countDocuments(filter );
    return {docs,page,countDocs,totalpages: Math.ceil(countDocs / size)};
}




async findOneAndUpdate({
  filter ,
  update,
  options
}: {
  filter?: QueryFilter<TRawDoc>,
  update?: UpdateQuery<TRawDoc> | UpdateWithAggregationPipeline,
  options?: QueryOptions<TRawDoc>
}) {
  return this.model.findOneAndUpdate(
    filter, update, {updatePipeline:true});
}

}
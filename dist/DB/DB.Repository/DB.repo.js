"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseRepository = void 0;
class DatabaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create({ data, options }) {
        return await this.model.create(data, options);
    }
    async createOne({ data, options }) {
        const [doc] = await this.create({ data: [data], options }) || [];
        return doc;
    }
    async findOne({ filter, projection, options }) {
        return await this.model.findOne(filter, projection, options);
    }
    async findById({ _id, projection, options }) {
        return await this.model.findById(_id, projection);
    }
    async updateOne({ filter, update, options }) {
        return await this.model.updateOne(filter, update, options);
    }
    async Delete({ filter }) {
        return await this.model.deleteOne(filter);
    }
    async find({ filter = {}, projection, options }) {
        return this.model.find({
            ...filter
        }, projection, options);
    }
    async paginateTest({ filter, projection, options, page = 1, size = 3 }) {
        const skip = (page - 1) * size;
        const docs = await this.model.find(filter, projection, options).skip(skip).limit(size);
        const countDocs = await this.model.countDocuments(filter);
        return { docs, page, countDocs, totalpages: Math.ceil(countDocs / size) };
    }
    async findOneAndUpdate({ filter, update, options }) {
        return this.model.findOneAndUpdate(filter, update, { updatePipeline: true });
    }
}
exports.DatabaseRepository = DatabaseRepository;

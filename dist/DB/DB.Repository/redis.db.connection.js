"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedies = exports.readisClient = void 0;
const redis_1 = require("redis");
const config_1 = require("../../config/config");
exports.readisClient = (0, redis_1.createClient)({
    url: config_1.REDIS_URI
});
const connectRedies = async () => {
    try {
        await exports.readisClient.connect();
        console.log("Connected to Redis");
    }
    catch {
        console.error("Error connecting to Redis");
    }
};
exports.connectRedies = connectRedies;

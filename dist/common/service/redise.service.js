"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_db_connection_1 = require("../../DB/DB.Repository/redis.db.connection");
class Rediseservice {
    async set({ key, value, exType = "EX", exValue = 120 }) {
        await redis_db_connection_1.readisClient.set(key, value, {
            expiration: { type: exType, value: Math.floor(exValue) }
        });
    }
    getblackList({ userId, tokenId }) {
        return `OTP::${userId}::${tokenId}::Blocked`;
    }
    getOTPkey({ email, emailType }) {
        return `OTP::${email}::${emailType}`;
    }
    getOTPReqNokey({ email, emailType }) {
        return `OTP::${email}::${emailType}::No`;
    }
    getOTPBlocekdkey({ email, emailType }) {
        return `OTP::${email}::${emailType}::Blocked`;
    }
    async get(key) {
        return await redis_db_connection_1.readisClient.get(key);
    }
    async mget(keys) {
        return await redis_db_connection_1.readisClient.mGet(keys);
    }
    async ttl(keys) {
        return await redis_db_connection_1.readisClient.ttl(keys);
    }
    async exists(keys) {
        return await redis_db_connection_1.readisClient.exists(keys);
    }
    async persist(keys) {
        return await redis_db_connection_1.readisClient.persist(keys);
    }
    async del(keys) {
        return await redis_db_connection_1.readisClient.del(keys);
    }
    async setExpire(keys, seconds) {
        return await redis_db_connection_1.readisClient.expire(keys, seconds);
    }
    async incr(keys) {
        return await redis_db_connection_1.readisClient.incr(keys);
    }
    async decr(keys) {
        return await redis_db_connection_1.readisClient.decr(keys);
    }
    async update(key, value) {
        if (!(await this.exists(key))) {
            return 0;
        }
        await redis_db_connection_1.readisClient.set(key, value);
        return 1;
    }
    getFCMKey(userId) {
        return `FCM::${userId}`;
    }
    async addToSet(userId, fcmToken) {
        return await redis_db_connection_1.readisClient.sAdd(this.getFCMKey(userId), fcmToken);
    }
    async getSetMembers(userId) {
        return await redis_db_connection_1.readisClient.sMembers(this.getFCMKey(userId));
    }
}
exports.default = new Rediseservice();

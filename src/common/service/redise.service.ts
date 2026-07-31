
import { Types } from "mongoose"
import { readisClient } from "../../DB/DB.Repository/redis.db.connection"
import { EmailTypeEnum } from "../enums/email.enums"


class Rediseservice{



  async set({key, value,exType="EX",exValue=120}:{key: string, value: string | number, exType?: 'EX' | 'PX' | 'EXAT' | 'PXAT', exValue?: number}){
    await readisClient.set(key, value,
      {
        expiration:{type: exType, value: Math.floor(exValue)}
      }
    )
  }
getblackList({userId,tokenId}:{userId: string, tokenId: string}){
    return `OTP::${userId}::${tokenId}::Blocked`
  }
  getOTPkey({email,emailType}:{email: string, emailType: EmailTypeEnum}){
    return `OTP::${email}::${emailType}`
  }

  getOTPReqNokey({email,emailType}:{email: string, emailType: EmailTypeEnum}){
    return `OTP::${email}::${emailType}::No`
  }

  getOTPBlocekdkey({email,emailType}:{email: string, emailType: EmailTypeEnum}){
    return `OTP::${email}::${emailType}::Blocked`
  }

  async get(key: string) {
    return await readisClient.get(key);
  }

  async mget(keys:string[]){
    return await readisClient.mGet(keys)
  }

  async ttl(keys: string){
    return await readisClient.ttl(keys)
  }

  async exists(keys: string | string[]){
    return await readisClient.exists(keys)
  }

  async persist(keys: string){
    return await readisClient.persist(keys)
  }

  async del(keys: string[]){
    return await readisClient.del(keys)
  }
  async setExpire(keys: string, seconds: number){
    return await readisClient.expire(keys, seconds)
  }

  async incr(keys: string){
    return await readisClient.incr(keys)
  }
  async decr(keys: string){
    return await readisClient.decr(keys)
  }

  async update(key: string, value: string | number){
    if (!(await this.exists(key))){
      return 0;
    }
    await readisClient.set(key,value)
    return 1;
  }
getFCMKey(userId: Types.ObjectId|string){
    return `FCM::${userId}`
  }
  async addToSet(userId: Types.ObjectId|string, fcmToken: string){
    return await readisClient.sAdd(this.getFCMKey(userId), fcmToken)
  }
  async getSetMembers(userId: Types.ObjectId|string){
    return await readisClient.sMembers(this.getFCMKey(userId))
  }
}

export default new Rediseservice()
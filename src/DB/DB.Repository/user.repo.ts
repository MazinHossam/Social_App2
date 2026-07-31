import { IUser } from "../../common/interfaces";
import { DatabaseRepository } from "./DB.repo";
import {UserModel} from '../model/user.model'


  class UserRepository extends DatabaseRepository<IUser> {
    constructor(){
        super(UserModel)
    }
}

export default new UserRepository()

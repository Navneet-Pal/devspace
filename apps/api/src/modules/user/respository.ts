import { User } from "./model.js";
import { IUser } from "./types.js";


export class UserRespository{
  async findByEmail(email:string){
    return User.findOne({email});
  }

  async findById(id : string){
    return User.findById(id);
  }

  async create(data: Partial<IUser> ){
    return User.create(data);
  }

  async updateRefreshToken( id: string, refreshToken: string){
    return User.findByIdAndUpdate(
      id,
      {refreshToken}, 
    );
  }

  async findByEmailWithPassword(email:string){
    return User.findOne({email}).select("+password");
  }
  
}

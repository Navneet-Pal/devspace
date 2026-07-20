import { VerificationToken } from "./model.js";
import { TokenType } from "./types.js";


export class VerificationRepository{

    async create(userId:string,token:string,expiresAt:Date ,type:TokenType ){
        return VerificationToken.create({userId,token,expiresAt ,type})   
    }

    async findByToken(token : string){
        return VerificationToken.findOne({token});
    }

    async deleteByToken(token : string){
        return VerificationToken.findOneAndDelete({token});
    }

    async deleteByUserIdAndType(id:string, type:TokenType){
        return VerificationToken.deleteMany({id,type});
    }
}
import { ApiError } from "../../utils/ApiError.js";
import { UserRespository } from "../user/respository.js";
import { RegisterInput } from "./validation.js";
import bcrypt from "bcrypt";


export class AuthService{
    private userRespository = new UserRespository();

    async register(data : RegisterInput){
        const existingUser = await this.userRespository.findByEmail(data.email);

        if(existingUser){
            throw new ApiError(409,"User already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password ,10);

        const user = await this.userRespository.create({...data,password:hashedPassword});
        return user;
    }
}
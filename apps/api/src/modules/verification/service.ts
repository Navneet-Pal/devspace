import { ApiError } from "../../utils/ApiError.js";
import { UserRepository } from "../user/respository.js";
import { VerificationRepository } from "./respository.js";

export class VerificationService{
    private verificationRepository = new VerificationRepository;
    private userRepository = new UserRepository;

    async verifyEmail(token:string){
        const verificationToken = await this.verificationRepository.findByToken(token);

        if(!verificationToken){
            throw new ApiError(400,"Invalid Verification token");
        }

        if(verificationToken.expiresAt < new Date()){
            throw new ApiError(400,"Verification token has expired");
        }

        const user = await this.userRepository.findById(verificationToken.userId.toString());

        if(!user){
            throw new ApiError(404,"user not found");
        }

        await this.userRepository.updateVerificationStatus(user.id.toString() , true);
        
        await this.verificationRepository.deleteByToken(token); 
        return;
    }
};
import { IUser } from "../modules/user/types.ts";

declare global{
    namespace Express{
        interface Request {
            user : IUser;
        }
    }
}

export {};
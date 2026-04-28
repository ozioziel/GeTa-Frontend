import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import { IdentityProxyService } from "src/modules/identity/services/identity-proxy.service";
import * as bcrypt from "bcrypt"
@Injectable()
export class AuthService{
    constructor(
        private readonly identityProxy: IdentityProxyService,
    ){}

    async login(dto: LoginDto){
        const  user = await this.identityProxy.findUserByEmail(dto.email);
        if (!user){
            throw new UnauthorizedException("Credenciales invalidass");
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);

        if (!isPasswordValid){
            throw new UnauthorizedException("Credenciales invalidas")
        }

        return {
            message: "Login",
            user
        };
    }

}
import { Controller, Get} from '@nestjs/common'
import { AuthService } from '../services/auth.service'
import { Body, Post} from '@nestjs/common'
import { LoginDto} from '../dto/login.dto'

@Controller('auth')
export class AuthController{
    constructor(private readonly authService: AuthService){

    }

    @Post('login')
    login(@Body() dto:LoginDto){
        return this.authService.login(dto);
    }
}
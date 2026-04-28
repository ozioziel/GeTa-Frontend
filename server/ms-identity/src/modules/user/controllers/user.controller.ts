import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {UserService} from '../services/user.service';
import {User} from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto';
@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService){}

    @Post()
    async create(@Body() createUserDto: CreateUserDto){
        return await this.userService.create(createUserDto)
    }
    @Get()
    async findAll(): Promise<User[]>{
            return await this.userService.findAll();
        }

    @Get('email/:email')
    async findByEmail(@Param('email') email: string){
        return this.userService.findByEmail(email);
    }
}
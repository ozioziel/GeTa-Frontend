import {Injectable} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt'
@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async create(createUserDto: CreateUserDto): Promise<User>{

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = this.userRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return await this.userRepository.save(user);
    }
        async findAll(): Promise<User[]>{
        return await this.userRepository.find();
    }
    async findByEmail(email: string){
        return await this.userRepository.findOne({ 
            where: { email}
        })
    }
}
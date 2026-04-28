import {IsEmail , IsNotEmpty, IsString , MinLength} from 'class-validator';

export class LoginDto{

    @IsEmail()
    @IsNotEmpty()
    email!: string;


    @IsNotEmpty()
    @MinLength(6)
    @IsString()
    password!: string;
}
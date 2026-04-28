import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs';
@Injectable()
export class IdentityProxyService{
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService

    ){}

    async findUserByEmail(email:string) {

        const baseUrl = this.configService.get<string>('MS_IDENTITY_URL');
        
        const response = await firstValueFrom(
            this.httpService.get(`${baseUrl}/users/email/${email}`),
            );
        return response.data;
    }
}
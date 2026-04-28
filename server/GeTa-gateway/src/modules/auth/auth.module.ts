import { Module } from '@nestjs/common'
import { AuthService } from './services/auth.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { AuthController } from './controllers/auth.controller';
import { IdentityModule } from '../identity/identity.module';

@Module({
    imports: [IdentityModule],
    controllers: [AuthController],
    providers: [AuthService]
})

export class AuthModule{}
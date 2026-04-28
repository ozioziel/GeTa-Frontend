import { Module} from '@nestjs/common'
import { IdentityProxyService } from './services/identity-proxy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [IdentityProxyService],
    exports: [IdentityProxyService]
})

export class IdentityModule{}
import { Module } from '@nestjs/common';
import { MyConfigModule } from './infrastructure/config/config.module';
import { MyDatabaseModule } from './infrastructure/database/database.module';
import { UserModule } from './modules/user/user.module';


@Module({
    imports:[
      MyConfigModule,
      MyDatabaseModule,
      UserModule
    ]
})
export class AppModule {}

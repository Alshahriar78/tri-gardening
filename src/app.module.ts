import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersRoleModule } from './users_role/users_role.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AudiosModule } from './audios/audios.module';
import { QuotesModule } from './quotes/quotes.module';
import { VisualsModule } from './visuals/visuals.module';
import { FeaturedsModule } from './featureds/featureds.module';

@Module({
  imports: [UsersRoleModule,
    TypeOrmModule.forRoot({
      type: 'mssql',
      host:  process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database:  process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      options: {
        encrypt: true,          
        trustServerCertificate: true, 
      },
    }),
    UsersModule,AuthModule, AudiosModule, QuotesModule, VisualsModule, FeaturedsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
const dbConfig = require('../ormconfig');
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot(dbConfig),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'postgres',
    //       host: config.get<string>('DB_HOST'),
    //       port: config.get<number>('DB_PORT'),
    //       username: config.get<string>('DB_USER'),
    //       password: config.get<string>('DB_PASSWORD'),
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       ssl: {
    //         rejectUnauthorized: false,
    //       },
    //       synchronize: true,
    //     };
    //   },
    // }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {
    //     return {
    //       type: 'sqlite',
    //       database: config.get<string>('DB_NAME'),
    //       entities: [User, Report],
    //       synchronize: true,
    //     };
    //   },
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'learning.db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

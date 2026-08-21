import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CityEntity } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity]), AuthModule],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}

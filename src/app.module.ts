import { Module } from '@nestjs/common';
import { DeducibleController } from './deducible/adapters/deducible.controller';
import { DeducibleDomainService } from './deducible/domain/service/deducibleService';
import { DeducibleRepositoryImpl } from './deducible/infrastructure/deducible.repository.impl';
import { GetDeducibleUseCase } from './deducible/application/getDeducible.usecase';
@Module({
  controllers: [DeducibleController],
  providers: [
    DeducibleDomainService,
    GetDeducibleUseCase,
    {
      provide: 'DeducibleInterfaceRepository',
      useClass: DeducibleRepositoryImpl
    }
  ]
})
export class AppModule {}

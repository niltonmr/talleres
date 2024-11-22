import { defineFeature, loadFeature } from 'jest-cucumber';
import { TestingModule, Test } from '@nestjs/testing';
import { DeducibleController } from '../../src/deducible/adapters/deducible.controller';
import { GetDeducibleUseCase } from '../../src/deducible/application/getDeducible.usecase';
import { DeducibleDomainService } from '../../src/deducible/domain/service/deducibleService';
import { DeducibleRepositoryImpl } from '../../src/deducible/infrastructure/deducible.repository.impl';
import { request as req, response as res } from './datos.json';

const feature = loadFeature('./getDeducible.feature', {
  loadRelativePath: true,
  errors: true
});

defineFeature(feature, test => {
  let deducibleController: DeducibleController;
  let getDeducibleUseCase: GetDeducibleUseCase;
  let response: any;

  test('Póliza con deducible texto plano', ({ given, when, then }) => {
    let request: any;

    given(/^la póliza tiene un deducible en forma del (.*)$/, (texto: string) => {
      const query = {};
      const path = {};
      const body = req[texto] || '';
      const headers = {};
      request = {
        body,
        query,
        path,
        headers
      };
    });

    when('ejecutamos el conversor de deducible', async () => {
      const controllers = [DeducibleController];
      const providers = [
        DeducibleDomainService,
        GetDeducibleUseCase,
        {
          provide: 'DeducibleInterfaceRepository',
          useClass: DeducibleRepositoryImpl
        }
      ];

      const module: TestingModule = await Test.createTestingModule({
        controllers,
        providers
      }).compile();

      deducibleController = module.get<DeducibleController>(DeducibleController);
      getDeducibleUseCase = module.get<GetDeducibleUseCase>(GetDeducibleUseCase);

      response = await deducibleController.getDeducible(request.body);

      console.log('response', JSON.stringify(response, null, 2));
    });

    then(/^obtenemos la parametrización del deducible en (.*)$/, (detalle: string) => {
      const expectedDeducibles = res[detalle] || {};
      const actualDeducibles = response;

      expect(actualDeducibles).toEqual(expectedDeducibles);
    });
  });
});

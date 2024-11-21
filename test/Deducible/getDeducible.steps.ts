import { loadFeature, defineFeature } from 'jest-cucumber';
import { DeducibleController } from '../../src/deducible/adapters/deducible.controller';
import { GetDeducibleUseCase } from '../../src/deducible/application/getDeducible.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { DeducibleDomainService } from '../../src/deducible/domain/service/deducibleService';
import { DeducibleRepositoryImpl } from '../../src/deducible/infrastructure/deducible.repository.impl';

let deducibleController: DeducibleController;
let getDeducibleUseCase: GetDeducibleUseCase;
let deducibleText: string;

const feature = loadFeature('./getDeducible.feature', {
  loadRelativePath: true,
  errors: true
});

defineFeature(feature, test => {
  test('ES001 Get deducible from text', ({ given, when, then }) => {
    let request: any;
    let response: any;

    given(/^a deducible text (.*)$/, (deducibleText: string) => {
      const query = {};
      const path = {};
      const body = { deducibleText };
      const payload = {};
      const headers = {};
      request = {
        body,
        query,
        path,
        payload,
        headers
      };
    });

    when('I request to get the deducible', async () => {
      let controllers = [DeducibleController];
      let providers = [];

      providers = [
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

      response = await deducibleController.getDeducible(request);

      console.log('response', JSON.stringify({ response }, null, 2));
    });

    then(/^the deducible should be processed$/, () => {
      expect(response).toHaveProperty('_valor');
    });
  });
});

import { loadFeature, defineFeature } from 'jest-cucumber';
import { DeducibleController } from '../../src/deducible/adapters/deducible.controller';
import { GetDeducibleUseCase } from '../../src/deducible/application/getDeducible.usecase';
import { Test, TestingModule } from '@nestjs/testing';
import { DeducibleDomainService } from '../../src/deducible/domain/service/deducibleService';
import { DeducibleRepositoryImpl } from '../../src/deducible/infrastructure/deducible.repository.impl';

let deducibleController: DeducibleController;
let getDeducibleUseCase: GetDeducibleUseCase;
let deducibleText: string;
let response: any;

const feature = loadFeature('./getDeducible.feature', {
  loadRelativePath: true,
  errors: true
});

defineFeature(feature, test => {
  test('ES001 Get deducible from text', ({ given, when, then }) => {
    let request: any;

    given('a deducible text', (text: string) => {
      deducibleText = text;
      const query = {};
      const path = {};
      const body = { payload: { text: deducibleText } };
      const headers = {};
      request = {
        body,
        query,
        path,
        headers
      };
    });

    when('I request to get the deducible', async () => {
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

    then('the response should contain the following deducibles', (expectedResponse: string) => {
      const expectedDeducibles = JSON.parse(expectedResponse);
      const actualDeducibles = response;

      expect(actualDeducibles).toEqual(expectedDeducibles);
    });
  });
});

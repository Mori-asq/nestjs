import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        ConfigService,
        // Any other providers your AppService might depend on
      ],
    }).compile();

    appController = moduleFixture.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "WELCOME TO HOME PAGE!"', () => {
      expect(appController.getHello()).toBe('WELCOME TO HOME PAGE!');
    });
  });
});

import { container } from 'tsyringe';

import IStorageProvider from './storageProvider/models/IStorageProvider';
import DiskStorageProvider from './storageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

import IMailTemplateProvider from './mailTempleteProvider/models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './mailTempleteProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider,
);

import IMailProvider from './mailProvider/models/IMailProvider';
import EtherealMailProvider from './mailProvider/implementations/EtherealMailProvider';

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherealMailProvider),
);

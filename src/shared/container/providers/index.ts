import { container } from 'tsyringe';

import IStorageProvider from './storageProvider/models/IStorageProvider';
import DiskStorageProvider from './storageProvider/implementations/DiskStorageProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

// import IMailProvider from './mailProvider/models/IMailProvider';
// import DiskStorageProvider from './mailProvider/implementations';

// container.registerSingleton<IStorageProvider>(
//   'StorageProvider',
//   DiskStorageProvider,
// );
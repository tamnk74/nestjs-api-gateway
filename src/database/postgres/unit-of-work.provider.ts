import { PostgresUnitOfWork } from './unit-of-work';
import { PostgresTransactionalRepository } from './transactional.repository';

export const unitOfWorkProviders = [
  PostgresUnitOfWork,
  PostgresTransactionalRepository,
];

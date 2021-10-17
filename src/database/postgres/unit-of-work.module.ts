import { forwardRef, Module } from '@nestjs/common';
import { PostgresDatabaseModule } from './connection/database.module';
import { unitOfWorkProviders } from './unit-of-work.provider';

@Module({
  imports: [forwardRef(() => PostgresDatabaseModule)],
  providers: [...unitOfWorkProviders],
  exports: [...unitOfWorkProviders],
})
export class PostgresUnitOfWorkModule {}

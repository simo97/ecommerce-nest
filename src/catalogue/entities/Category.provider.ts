import { DataSource } from 'typeorm';
import { Category } from './Category.entity';
import { CATEGORY_REPOSITORY, DATA_SOURCE } from '../../common/contants';

export const categoryProviders = [
  {
    provide: CATEGORY_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
    inject: [DATA_SOURCE],
  },
];

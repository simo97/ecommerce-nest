import { DataSource } from 'typeorm';
import { Product } from './Product.entity';
import { PRODUCT_REPOSITORY, DATA_SOURCE } from '../../common/contants';

export const productProviders = [
  {
    provide: PRODUCT_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Product),
    inject: [DATA_SOURCE],
  },
];

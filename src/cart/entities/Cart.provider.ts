import { DataSource } from 'typeorm';
import { Cart } from './Cart.entity';
import { CART_REPOSITORY, DATA_SOURCE } from '../../common/contants';

export const cartProviders = [
  {
    provide: CART_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
    inject: [DATA_SOURCE],
  },
];

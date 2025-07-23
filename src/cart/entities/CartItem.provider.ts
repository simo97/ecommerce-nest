import { DataSource } from 'typeorm';
import { CartItem } from './CartItem.entity';
import { CART_ITEM_REPOSITORY, DATA_SOURCE } from '../../common/contants';

export const cartItemProviders = [
  {
    provide: CART_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
    inject: [DATA_SOURCE],
  },
];

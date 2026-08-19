import { ProductEvent } from './event-bridge.types';
import { createProduct } from './services/product-created.service';
import { addProductImages } from './services/product-image-added.service';

export const eventBridgeProducts = async (event: ProductEvent): Promise<void> => {
  console.log(JSON.stringify(event, null, 2));

  switch (event['detail-type']) {
    case 'product.created':
      await createProduct(event.detail);
      break;
    case 'product.image.added':
      await addProductImages(event.detail);
      break;
  }
};

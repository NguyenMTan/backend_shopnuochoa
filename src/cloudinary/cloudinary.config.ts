import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export const CloudinaryConfig = {
  provide: 'Cloudinary',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: 'dwt5jjcjw',
      api_key: '599563817915757',
      api_secret: 'bcqpRq4w5n6-szWQ3WEuMyHmbvE',
    });
  },
};

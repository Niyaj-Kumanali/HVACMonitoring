import thingsboardAPI from "./thingsboardAPI";


// Upload Image
export const uploadImage = async (imageData: FormData): Promise<any> => {
  const response = await thingsboardAPI.post('/image', imageData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response; // Return the full response object
};

// Import Image
export const importImage = async (importData: any): Promise<any> => {
  const response = await thingsboardAPI.put('/image/import', importData);
  return response; // Return the full response object
};

// Get Images
export const getImages = async (params: {
  pageSize?: number;
  page?: number;
  includeSystemImages?: boolean;
  textSearch?: string;
  sortProperty?: string;
  sortOrder?: string;
}): Promise<any> => {
  const response = await thingsboardAPI.get('/images', { params });
  return response; // Return the full response object
};

// Download Image
export const downloadImage = async (type: string, key: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/images/${type}/${key}`, {
    responseType: 'blob',
  });
  return response; // Return the full response object
};

// Update Image
export const updateImage = async (type: string, key: string, imageData: any): Promise<any> => {
  const response = await thingsboardAPI.put(`/images/${type}/${key}`, imageData);
  return response; // Return the full response object
};

// Delete Image
export const deleteImage = async (type: string, key: string, force?: boolean): Promise<any> => {
  const response = await thingsboardAPI.delete(`/images/${type}/${key}`, { params: { force } });
  return response; // Return the full response object
};

// Export Image
export const exportImage = async (type: string, key: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/images/${type}/${key}/export`, {
    responseType: 'blob',
  });
  return response; // Return the full response object
};

// Get Image Info
export const getImageInfo = async (type: string, key: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/images/${type}/${key}/info`);
  return response; // Return the full response object
};

// Update Image Info
export const updateImageInfo = async (type: string, key: string, infoData: any): Promise<any> => {
  const response = await thingsboardAPI.put(`/images/${type}/${key}/info`, infoData);
  return response; // Return the full response object
};

// Download Image Preview
export const downloadImagePreview = async (type: string, key: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/images/${type}/${key}/preview`, {
    responseType: 'blob',
  });
  return response; // Return the full response object
};

// Update Image Public Status
export const updateImagePublicStatus = async (type: string, key: string, isPublic: boolean): Promise<any> => {
  const response = await thingsboardAPI.put(`/images/${type}/${key}/public/${isPublic}`);
  return response; // Return the full response object
};

// Download Public Image
export const downloadPublicImage = async (publicResourceKey: string): Promise<any> => {
  const response = await thingsboardAPI.get(`/images/public/${publicResourceKey}`, {
    responseType: 'blob',
  });
  return response; // Return the full response object
};

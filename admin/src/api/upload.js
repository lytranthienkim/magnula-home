import apiClient from './config.js';

const uploadImageToR2 = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

const deleteImageFromR2 = async (imageUrl) => {
  const response = await apiClient.delete('/upload', {
    data: { imageUrl },
  });

  return response.data;
};

export { uploadImageToR2, deleteImageFromR2 };

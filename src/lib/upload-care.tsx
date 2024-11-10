import { uploadFile } from '@uploadcare/upload-client';

const uploadCareUpload = async (file: File) => {
  console.log('hey this is the upload care key ')
  console.log(process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY)
  return await uploadFile(file, {
    publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY!,
    store: 'auto',
  });
};

export { uploadCareUpload };

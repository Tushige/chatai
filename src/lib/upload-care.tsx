import { uploadFile } from '@uploadcare/upload-client'

const uploadCareUpload = async (file: File) => {
  return await uploadFile(
    file,
    {
      publicKey: process.env.NEXT_PUBLIC_UPLOAD_CARE_PUBLIC_KEY!,
      store: 'auto'
    }
  )
}

export {
  uploadCareUpload
}
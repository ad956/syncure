import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPDFToCloudinary(pdfBuffer: Buffer, fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        public_id: `bills/${fileName.replace('.pdf', '')}`,
        format: 'pdf',
        access_mode: 'public',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          // Return URL with fl_attachment for direct download
          const downloadUrl = result?.secure_url?.replace('/upload/', '/upload/fl_attachment/');
          resolve(downloadUrl || result?.secure_url || '');
        }
      }
    ).end(pdfBuffer);
  });
}
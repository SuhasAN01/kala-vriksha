import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: { sizeLimit: '20mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { file } = req.body;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    console.log('Cloudinary config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
    });

    const result = await cloudinary.uploader.upload(file, {
      folder: 'kala-vriksha',
      resource_type: 'auto',
    });

    return res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary error full:', err.message);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}

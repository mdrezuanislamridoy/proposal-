import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import { UAParser } from 'ua-parser-js';

// MongoDB Connection Caching
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err);
    }
  } else {
    console.warn('No MONGODB_URI found.');
  }
};

// Mongoose Schema (Avoid redefining if already exists in cache)
const ResponseSchema = new mongoose.Schema({
  choice: String,
  device: Object,
  userAgent: String,
  createdAt: { type: Date, default: Date.now }
});

const ResponseModel = mongoose.models.Response || mongoose.model('Response', ResponseSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { choice } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const device = parser.getResult();

    if (isConnected) {
      const response = new ResponseModel({ choice, device, userAgent });
      await response.save();
    } else {
      console.log('Simulated save (No MONGODB_URI):', { choice, device, userAgent });
    }
    
    return res.status(200).json({ success: true, message: 'Response saved successfully' });
  } catch (error) {
    console.error('Error saving response:', error);
    return res.status(500).json({ success: false, error: 'Failed to save response' });
  }
}

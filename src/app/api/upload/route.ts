import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { validateImageFile } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'File gambar tidak ditemukan' },
        { status: 400 }
      );
    }

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: validation.error || 'File tidak valid' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key'
    ) {
      try {
        const imageUrl = await uploadImageToCloudinary(base64Image);
        return NextResponse.json({
          success: true,
          url: imageUrl,
          message: 'Gambar berhasil diupload ke Cloudinary',
        });
      } catch (cloudErr) {
        console.error('Cloudinary upload error:', cloudErr);
        return NextResponse.json({
          success: true,
          url: base64Image,
          message: 'Gambar diproses sebagai data URL lokal (Cloudinary config error)',
        });
      }
    }

    return NextResponse.json({
      success: true,
      url: base64Image,
      message: 'Gambar berhasil diproses (Mode Data URL)',
    });
  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      {
        success: true,
        message: 'Gagal mengupload gambar',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

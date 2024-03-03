import cloudinary from 'cloudinary';
import {NextResponse} from 'next/server'
cloudinary.v2.config({
  cloud_name: 'dxvf93ovn',
  api_key: '811916447675868',
  api_secret: 'k92voXXvcxQbkCzw2RQpanFBWbk',
  secure: true,
})
export async function POST(req, res) {
  const { public_id } = await req.json()
  try {
    const result = await cloudinary.v2.uploader.destroy(public_id, {
      invalidate: true,
      resource_type: 'image'
    })
    return NextResponse.json({result})
  } catch (e) {
    return NextResponse.json({ error: e.message });
  }
}
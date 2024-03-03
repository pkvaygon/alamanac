import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const post = await req.json()
    const addPost = await fetch('https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/post_post', {
        method: "POST",
        headers: {
        "Content-Type": 'application/json'
        },
        body: JSON.stringify(post)
    })
    return NextResponse.json(post)
}
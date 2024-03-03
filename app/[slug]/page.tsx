import Image from "next/image";
import { ImageDataProps } from "../new-almanac/page";



interface PostProps{
    slug: string,
    postTitle: string;
    postImage: {
        url: string,
        public_id: string,
    };
    content: {
      [key: string]: ImageDataProps | string;
    };
}

export async function generateStaticParams() {
    const posts = await fetch('https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/get_post', { next: { revalidate: 10 } })
    .then((res) => res.json())
    return posts.map((post: PostProps) => {
    slug: post.slug
    })
}
async function getPost(id: string) {
    const res = await fetch(`https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/get_post_by_id?id=${id}`)
    return res.json()
}

export default async function PostOverview({ params,searchParams } : {params: {slug: string}, searchParams:{id: string}}) {
    const { slug } = params
    const post = await getPost(searchParams.id);
    console.log('slug=>', slug)
    console.log('params=>', params)
    console.log('searchParams=>', searchParams)
    return (
        <section className="flex flex-col gap-3">
        {post ? (
          <>
            <div className="relative w-full h-[400px]">
              <Image fill priority src={post.postImage.url} objectFit="contain" alt={post.postTitle} />
            </div>
            <h1 className="text-4xl font-bold">{post.postTitle}</h1>
            <div>
              {/* Отображение значений блога */}
              {Object.entries(post.content).map(([key, value]) => (
                <div key={key}>
                  {key.startsWith("text_") ? (
                    <p>{value as string}</p>
                  ) : key.startsWith("image_") ? (
                    <Image width={300} height={250} src={(value as ImageDataProps).url} alt={`Image ${key}`} />
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>
        )

}
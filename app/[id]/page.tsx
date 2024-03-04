import Image from "next/image"
import { ImageDataProps } from "../new-almanac/page"



interface PageProps{
    params: {
    id: string
    },
    searchParams: {
        slug: string
    }
}

export async function generateStaticParams() {
    const posts = await fetch('https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/get_post')
    .then((res)=> res.json())
    return posts.map((post: any) => ({
        id: post._id,
    }))
}
export async function generateMetadata({params, searchParams}: PageProps) {
    const { id } = params
    const post = await getPost(id)
    return {
    title: post.postTitle,
    }
}
async function getPost(id: string) {
    const res = await fetch(`https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/get_post_by_id?id=${id}`)
    return res.json()
}
export default async function PostOverview({ params, searchParams }: PageProps) {
    const { id } = params
    const post = await getPost(id)
// console.log(post)
    return (
           <section className="flex flex-col gap-3 w-[90%] mx-auto">
        {post ? (
          <>
            
            <div className="relative w-full h-[400px]">
              <Image fill priority src={post.postImage.url} objectFit="contain" alt={post.postTitle} />
            </div>
            <h1 className="text-4xl font-bold">{post.postTitle}</h1>
            <div>
              {/* Отображение значений блога */}
              {Object.entries(post.content).map(([key, value]) => (
                <div className="flex flex-col gap-3" key={key}>
                  {key.startsWith("text_") ? (
                    <div className="my-2 bg-gray-500 light:text-black text-[#ffffff] p-4">
                      <p >{value as string}</p>
                    </div>
                  ) : key.startsWith("image_") ? (
                      <div className="relative w-auto h-[400px] my-2">
                        <Image fill objectFit="contain" src={(value as ImageDataProps).url} alt={`Image ${key}`} />
                      </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : null}
      </section>
        )

}
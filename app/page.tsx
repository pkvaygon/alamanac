import Image from "next/image";
import { ImageDataProps } from "./new-almanac/page";
import Link from "next/link";

 async function getAllPosts() {
   const res = await fetch('https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/get_post', {
   cache: 'no-store'
   });
  return res.json();
}

export default async function Home() {
  const posts = await getAllPosts();
console.log(posts[0])
  return (
    <>
      <Link href="new-almanac">Создать пост</Link>
    <section className="flex flex-col gap-3">
      <div className="relative w-full h-[400px]">
      <Image fill priority src={posts[0].postImage.url} objectFit="contain" alt={posts[0].postTitle} />
      </div>
      <h2>{posts[0].postTitle}</h2>
      {posts && posts.map((post: any) => (
        <div key={post._id}>
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
      ))}
      </section>
      </>
  );
}

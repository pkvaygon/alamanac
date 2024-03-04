import Image from "next/image";
import Link from "next/link";
async function getAllPosts() {
  const res = await fetch('https://us-central1.gcp.data.mongodb-api.com/app/almanac-nwvhl/endpoint/get_post', {
    cache: 'no-store'
  });
  return res.json();
}

export default async function Home() {
  const posts = await getAllPosts();
  // console.log(posts[0]);
  return (
    <section className="сontainer">
      <Link className="bg-black text-white px-3 py-2" href="new-almanac">Создать пост</Link>
      <h2 className="select-none mt-5 underline text-gray">После создания поста нужно обновить страницу</h2>
     
      <div className="grid grid-cols-3 gap-3 grid-flow-row mt-[50px]">
        {posts.length > 0 && (
          posts.map((post: any) => (
            <Link href={`/${post._id}?slug=${post.slug}`} key={post._id} className="aspect-square shadow-xl shadow-indigo-500/40 rounded-lg flex flex-col gap-2 ">
              <div className="relative w-full h-[40%] rounded-lg">
              <Image className="rounded-lg" fill priority objectFit="cover" src={post.postImage.url} alt={post.postTitle} />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-bold ">{post.postTitle}</h2>
                <h3 className="bg-[#006FEE] text-[#ffffff] pl-2">TypeScript</h3>
                <p>Описание : Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, dolorem quaerat, vero nesciunt sequi error adipisci at ut qui iusto vitae quasi. Eius, sequi eveniet.</p>
              </div>
        </Link>
            ))
        )
        
        }
        
      </div>
  
    </section>
  );
}

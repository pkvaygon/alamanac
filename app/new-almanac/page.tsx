"use client";
import React, { useState, ChangeEvent } from "react";
import { cn } from "@/cn";
import { Image, Button, Input, ScrollShadow, Card } from "@nextui-org/react";
import { CldUploadWidget } from 'next-cloudinary';
import { postImageAlt } from "@/utils";
import { deleteImageFromCloudinary } from '@/lib/deleteImage';
import { addPost } from '@/lib/addPost';
import { redirect, useRouter } from "next/navigation";
import { revalidatePath, revalidateTag } from "next/cache";


export interface ImageDataProps {
  url: string;
  public_id: string;
}

interface PostDataProps {
  postTitle: string;
  postImage: ImageDataProps;
  content: {
    [key: string]: ImageDataProps | string;
  };
}

export default function NewPostPage() {
  const router = useRouter()
  const [postData, setPostData] = useState<PostDataProps>({
    postTitle: '',
    postImage: {
      url: '',
      public_id: ''
    },
    content: {
      // url: '',
      // public_id: ''
    }
  });
  const [latestImageKey, setLatestImageKey] = useState<string | null>(null);
  const handlePostTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPostData((prev) => ({
      ...prev,
      postTitle: event.target.value
    }));
  };

  const handlePostImageChange = (url: string, public_id: string) => {
    setPostData((prev) => ({
      ...prev,
      postImage: {
        url,
        public_id
      }
    }));
  };

  const handleAddText = () => {
    const newTextKey = `text_${Object.keys(postData.content).length + 1}`;
    setPostData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [newTextKey]: ''
      }
    }));
    console.log(postData.content)
  };

  const handleTextChange = (key: string, value: string) => {
    setPostData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const handlePostImageRemove = async () => {
    await deleteImageFromCloudinary(postData.postImage.public_id);
    setPostData((prev) => ({
      ...prev,
      postImage: {
        url: '',
        public_id: ''
      }
    }));
  };

  const handleAddImage = () => {
    const newImageKey = `image_${Object.keys(postData.content).length + 1}`;
    const newImageObject = {
      [newImageKey]: {
        url: '',
        public_id: '',
      },
    };
    setPostData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        ...newImageObject,
      },
    }));
    
    setLatestImageKey(newImageKey);
  };
  
  const handleCreateUploadButton = (url: string, public_id: string) => {
    

    if (latestImageKey) {
      setPostData((prev) => {
        if (prev.content[latestImageKey]) {
          const updatedContent = {
            ...prev.content,
            [latestImageKey]: {
              url,
              public_id,
            },
          };

          return {
            ...prev,
            content: updatedContent,
          };
        }
        return prev;
      });
      setLatestImageKey('')
    }
  };
  const handleRemoveText = (key: string) => {
    const { [key]: removedText, ...restContent } = postData.content;
    setPostData((prev) => ({
      ...prev,
      content: restContent,
    }));
  };
  
  const handleRemoveImage = async (key: string) => {
    const { [key]: removedImage, ...restContent } = postData.content;
    const typedRemovedImage = removedImage as ImageDataProps;
  
    if (typedRemovedImage && typedRemovedImage.public_id) {
      await deleteImageFromCloudinary(typedRemovedImage.public_id);
    }
  
    setPostData((prev) => ({
      ...prev,
      content: restContent,
    }));
  };
  async function completePost(post : any) {
    await addPost(post)
    router.push('/')
  }
  React.useEffect(() => {
  console.log(postData.content)
  },[postData.content])
  return (
    <>
      <section className="flex w-full justify-between items-start">
        {/* Блок превью */}
        <div className="flex flex-col gap-4 p-4  overflow-y-auto">
          <div className="w-full max-w-[800px] h-auto overflow-hidden relative flex flex-col gap-3">
            <Image
              sizes="(max-width: 800px) 100vw, 800px"
              className="object-contain object-center max-h-[300px]"
              width={800}
              height={300}
              src={postData.postImage.url || postImageAlt}
              alt={postData.postTitle}
            />
            {postData.postImage.url && <button onClick={handlePostImageRemove}>Удалить Изображение</button>}
            <div className="absolute z-50 bottom-[50%] left-0 right-0 text-center">
              <h3 className="text-white text-lg bg-black/70 p-2 select-none">Главное изображение Блога</h3>
            </div>
            <h1 className="text-4xl font-bold select-none">{postData.postTitle || "Название Блога"}</h1> 
          </div>
          <div>
          {Object.entries(postData.content).map(([key, value], index) => (
  <div key={index}>
    {key.startsWith("text_") ? (
      <div>
        <p>{String(value)}</p>
        <Button onClick={() => handleRemoveText(key)}>Удалить</Button>
      </div>
    ) : key.startsWith("image_") && typeof value !== 'string' ? (
      <div>
        <Image
          src={value.url ||''}
          alt={`Image ${key.replace("image_", "")}`}
          width={300}
          height={200}
        />
        <Button onClick={() => handleRemoveImage(key)}>Удалить</Button>
      </div>
    ) : null}
  </div>
))}
          </div>
        </div>
        {/* Блок для создания поста */}
        <ScrollShadow
          hideScrollBar
          isEnabled
          className={cn(
            "relative bg-secondary-500 overflow-y-auto h-screen  gap-3 hidden w-0 max-w-[500px] flex-1 flex-col p-6 lg:flex lg:w-72"
          )}
        >
          <Card className="bg-[#E393F8] py-4 flex justify-center items-center">
            <Button onClick={()=>completePost(postData)}>Complete Post</Button>
          </Card>
          <div className="max-h-auto flex flex-col gap-2">
            <Input
              label="Post Title"
              type="text"
              placeholder="Post's Title"
              value={postData.postTitle}
              onChange={handlePostTitleChange}
            />
            <CldUploadWidget
              uploadPreset="almanac"
              options={{ sources: ['local', 'url', 'google_drive', 'image_search'] }}
              onSuccess={(result, { widget }) => {
                if (result?.info && typeof result.info === 'object') {
                  handlePostImageChange(result.info.secure_url, result.info.public_id);
                }
                widget.close();
              }}
            >
              {({ open }) => (
                <Button isDisabled={postData.postImage.url !== ''} onClick={() => open()}>
                  Загрузить Изображение Поста
                </Button>
              )}
            </CldUploadWidget>
            <div className="flex flex-col h-auto gap-3">
              <Button onClick={handleAddText}>Добавить текст</Button>
              <Button onClick={()=>handleAddImage()}>Добавить изображение</Button>
              {Object.entries(postData.content).map(([key, value]) => (
  <div key={key}>
    {key.startsWith("text_") ? (
      <Input
        label={`Text ${key.replace("text_", "")}`}
        type="text"
        placeholder={`Enter text`}
        value={String(value)}
        onChange={(event) => handleTextChange(key, event.target.value)}
      />
    ) : key.startsWith("image_") ? (
      <CldUploadWidget
        key={key}
        uploadPreset="almanac"
        options={{ sources: ['local', 'url', 'google_drive', 'image_search'] }}
        onSuccess={(result, { widget }) => {
          if (result?.info && typeof result.info === 'object' && result.info.secure_url) {
            handleCreateUploadButton(result.info.secure_url, result.info.public_id);
          }
          widget.close();
        }}
      >
        {({ open }) => (
          <Button  onClick={() => open()}>
            Загрузить Изображение Поста
          </Button>
        )}
      </CldUploadWidget>
    ) : null}
  </div>
))}
            </div>
          </div>
        </ScrollShadow>
      </section>
    </>
  );
}

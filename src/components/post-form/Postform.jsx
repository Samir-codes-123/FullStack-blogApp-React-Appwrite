import React, { useCallback } from "react";
import { set, useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../Button";
import service from "../../appwrite/conf";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Postform({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } =
    useForm({
      defaultValues: {
        title: post?.title || "",
        slug: post?.slug || "",
        content: post?.content || "",
        status: post?.status || "",
      },
    });
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData); // to retrieve userid

  const submit = async (data) => {
    if (post) {
      // if existing post is given then update
      const file = (await data.images[0])
        ? service.uploadFile(data.image[0])
        : null; // if the given data contains image then update the post
      // generates unique id for image
      if (file) {
        // if new image is given delete old image
        await service.deleteFile(post.featuredImage);
      }
      const dbPost = await service.updatePost(post.$id, {
        // now to update post with new data
        ...data,
        featuredImage: file ? file.$id : undefined, // pass image id
      });
      if (dbPost) {
        navigate(`/post/${dbPost.$id}`);
      }
    } else {
      // new post
      const file = (await data.image[0])
        ? service.uploadFile(data.image[0])
        : null;
      if (file) {
        const fileId = file.$id; // gets unique id from appwrite
        data.featuredImage = fileId; // post this id's image from db which was uploaded
        const dbPost = service.createPost({
          ...data,
          userId: userData.$id,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      }
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        // to convert title into slug
        setValue("slug", slugTransform(value.title, { shouldValidate: true }));
      }
    });
    return () => {
      subscription.unsubscribe(); // memory management
    };
  }, [watch, slugTransform, setValue]);
  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />
        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) => {
            // get the value from useeffect
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            });
          }}
        />
        <RTE
          label="Content :"
          name="content"
          control={control} // passing control or ref
          defaultValue={getValues("content")} // passing existing content if present
        />
      </div>
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={appwriteService.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default Postform;

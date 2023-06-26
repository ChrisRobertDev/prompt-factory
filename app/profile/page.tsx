"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import { Prompt } from "@types";

const MyProfile = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Prompt[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      //@ts-ignore
      const response = await fetch(`api/users/${session?.user.id}/posts`, {
        method: "GET",
      });
      const data = await response.json();
      // console.log("fetching profile posts");
      // console.log(data);
      setPosts(data);
    };

    fetchPosts();
  }, [session]);

  const handleEdit = (post: Prompt) => {
    router.push(`/update-prompt?id=${post._id}`);
  };
  const handleDelete = async (post: Prompt) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`api/prompt/${post._id.toString()}`, { method: "DELETE" });

        const filteredPosts = posts.filter((p) => p._id !== post._id);

        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;

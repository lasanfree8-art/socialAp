"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  }[] | null;
};

type Like = {
  post_id: number;
  user_id: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeed();
  }, []);

  async function loadFeed() {
    setLoading(true);

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select(`
        id,
        user_id,
        image_url,
        caption,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error("Posts error:", postsError);
    } else {
      setPosts((postsData as Post[]) || []);
    }

    const { data: likesData, error: likesError } = await supabase
      .from("likes")
      .select("post_id, user_id");

    if (likesError) {
      console.error("Likes error:", likesError);
    } else {
      setLikes((likesData as Like[]) || []);
    }

    setLoading(false);
  }

  async function toggleLike(postId: number) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      return;
    }

    const alreadyLiked = likes.some(
      (like) =>
        like.post_id === postId &&
        like.user_id === user.id
    );

    if (alreadyLiked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) {
        console.error("Unlike error:", error);
        return;
      }

      setLikes((current) =>
        current.filter(
          (like) =>
            !(
              like.post_id === postId &&
              like.user_id === user.id
            )
        )
      );
    } else {
      const { error } = await supabase
        .from("likes")
        .insert({
          post_id: postId,
          user_id: user.id,
        });

      if (error) {
        console.error("Like error:", error);
        return;
      }

      setLikes((current) => [
        ...current,
        {
          post_id: postId,
          user_id: user.id,
        },
      ]);
    }
  }

  function getLikeCount(postId: number) {
    return likes.filter(
      (like) => like.post_id === postId
    ).length;
  }

  function isLiked(postId: number, userId: string | undefined) {
    if (!userId) return false;

    return likes.some(
      (like) =>
        like.post_id === postId &&
        like.user_id === userId
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-8">

        <h1 className="mb-6 text-3xl font-bold">
          SocialAp
        </h1>

        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            Create a Post
          </h2>

          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
            Create Post
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">
            Loading posts...
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-gray-500">
              No posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {posts.map((post) => {
              const profile = post.profiles?.[0];

              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-lg bg-white shadow"
                >

                  <div className="flex items-center gap-3 p-4">

                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                        👤
                      </div>
                    )}

                    <p className="font-semibold">
                      {profile?.username || "User"}
                    </p>

                  </div>

                  <img
                    src={post.image_url}
                    alt="Post"
                    className="w-full object-cover"
                  />

                  <div className="p-4">

                    <div className="mb-3 flex gap-4">

                      <button
                        onClick={() => toggleLike(post.id)}
                        className="font-medium"
                      >
                        ❤️ Like
                      </button>

                      <button className="font-medium">
                        💬 Comment
                      </button>

                    </div>

                    <p className="font-semibold">
                      {getLikeCount(post.id)} likes
                    </p>

                    {post.caption && (
                      <p className="mt-2">
                        <span className="font-semibold">
                          {profile?.username || "User"}
                        </span>{" "}
                        {post.caption}
                      </p>
                    )}

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}

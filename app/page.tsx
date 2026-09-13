"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: number;
  user_id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">SocialAp</h1>

        {/* Create Post */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            Create a Post
          </h2>

          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
            Create Post
          </button>
        </div>

        {/* Feed */}
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
            {posts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-4">
                  <p className="font-semibold">
                    User
                  </p>
                </div>

                <img
                  src={post.image_url}
                  alt="Post"
                  className="w-full object-cover"
                />

                <div className="p-4">
                  <div className="mb-3 flex gap-4">
                    <button>❤️ Like</button>
                    <button>💬 Comment</button>
                  </div>

                  <p className="font-semibold">
                    0 likes
                  </p>

                  {post.caption && (
                    <p className="mt-2">
                      {post.caption}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

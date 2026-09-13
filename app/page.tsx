export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">SocialAp</h1>

        {/* Create Post */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Create a Post</h2>

          <button className="rounded-md bg-blue-600 px-4 py-2 text-white">
            Create Post
          </button>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          <article className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-4">
              <p className="font-semibold">Username</p>
            </div>

            <div className="flex h-96 items-center justify-center bg-gray-200">
              <p className="text-gray-500">Post Image</p>
            </div>

            <div className="p-4">
              <div className="mb-3 flex gap-4">
                <button>❤️ Like</button>
                <button>💬 Comment</button>
              </div>

              <p className="font-semibold">0 likes</p>
              <p className="mt-2">
                <span className="font-semibold">Username</span>{" "}
                Your caption will appear here.
              </p>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}

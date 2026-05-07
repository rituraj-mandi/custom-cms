"use client";

import { useRouter } from "next/navigation";

import { Post } from "@/types/post";

export default function PostCard({
  post,
}: {
  post: Post;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() =>
        router.push(`/${post.slug}`)
      }
      className="cursor-pointer rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700"
    >
      <h2 className="text-2xl font-bold">
        {post.title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-300">
          {post.category}
        </span>

        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-300">
          {post.subcategory}
        </span>
      </div>

      <div className="mt-5 text-zinc-500">
        {new Date(
          post.created_at
        ).toLocaleDateString()}
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Props = {
  post: {
    id: string;
    title: string;
    slug: string;
    category: string;
    subcategory: string;
    created_at: string;
  };

  onDelete?: (id: string) => void;
};

export default function PostCard({
  post,
  onDelete,
}: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    const password = prompt(
      "Enter admin password to confirm deletion"
    );

    if (!password) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      alert("Failed to delete post");
      return;
    }

    onDelete?.(post.id);

    alert("Post deleted successfully");
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4">
        <h2 className="line-clamp-2 text-2xl font-bold text-white">
          {post.title}
        </h2>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
            {post.category}
          </span>

          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
            {post.subcategory}
          </span>
        </div>
      </div>

      <div className="mb-6 text-sm text-zinc-500">
        {new Date(
          post.created_at
        ).toLocaleDateString()}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() =>
            router.push(
              `/editor/${post.slug}`
            )
          }
          className="flex-1 rounded-2xl bg-white px-4 py-2 font-medium text-black transition hover:opacity-90"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 font-medium text-red-400 transition hover:bg-red-500/20"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";

import { Post } from "@/types/post";

export default function SearchDropdown({
  posts,
  search,
}: {
  posts: Post[];

  search: string;
}) {
  if (!search.trim()) return null;

  const filtered = posts
    .filter((post) =>
      post.title
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )
    .slice(0, 8);

  if (filtered.length === 0)
    return null;

  return (
    <div className="absolute top-full mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
      {filtered.map((post) => (
        <Link
          key={post.id}
          href={`/${post.slug}`}
          className="block border-b border-zinc-800 px-4 py-3 transition hover:bg-zinc-800"
        >
          {post.title}
        </Link>
      ))}
    </div>
  );
}
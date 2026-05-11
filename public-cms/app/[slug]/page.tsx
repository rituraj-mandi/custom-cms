import { supabase } from "@/lib/supabase";

import { notFound } from "next/navigation";

import Link from "next/link";

import RenderBlocks from "@/components/RenderBlocks";

import Navbar from "@/components/Navbar";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } =
    await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single();

  if (!post) {
    notFound();
  }

  const { data: posts } =
    await supabase
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar posts={posts || []} />

      <article className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-5xl font-bold leading-tight">
          {post.title}
        </h1>

        <div className="mt-4 text-zinc-500">
          {new Date(
            post.created_at
          ).toLocaleDateString()}
        </div>

        <div className="mt-10 space-y-8">
          <RenderBlocks
            blocks={
              post.content
                ?.blocks || []
            }
          />
        </div>
      </article>
    </main>
  );
}
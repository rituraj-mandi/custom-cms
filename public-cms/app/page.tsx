"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import Navbar from "@/components/Navbar";

import PostCard from "@/components/PostCard";

import { Post } from "@/types/post";

export default function HomePage() {
  const [posts, setPosts] =
    useState<Post[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [category, setCategory] =
    useState("All");

  const [subcategory, setSubcategory] =
    useState("All");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } =
      await supabase
        .from("posts")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error && data) {
      setPosts(data);
    }

    setLoading(false);
  };

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        posts.map(
          (post) => post.category
        )
      ),
    ];
  }, [posts]);

  const subcategories = useMemo(() => {
    const filtered =
      category === "All"
        ? posts
        : posts.filter(
            (post) =>
              post.category ===
              category
          );

    return [
      "All",
      ...new Set(
        filtered.map(
          (post) =>
            post.subcategory
        )
      ),
    ];
  }, [posts, category]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        category === "All" ||
        post.category === category;

      const matchesSubcategory =
        subcategory === "All" ||
        post.subcategory ===
          subcategory;

      return (
        matchesCategory &&
        matchesSubcategory
      );
    });
  }, [
    posts,
    category,
    subcategory,
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar posts={posts} />

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row">
          <select
            value={category}
            onChange={(e) => {
              setCategory(
                e.target.value
              );

              setSubcategory(
                "All"
              );
            }}
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none"
          >
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>
            ))}
          </select>

          <select
            value={subcategory}
            onChange={(e) =>
              setSubcategory(
                e.target.value
              )
            }
            className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 outline-none"
          >
            {subcategories.map(
              (sub) => (
                <option
                  key={sub}
                  value={sub}
                >
                  {sub}
                </option>
              )
            )}
          </select>
        </div>

        {loading ? (
          <div>
            Loading posts...
          </div>
        ) : filteredPosts.length ===
          0 ? (
          <div>
            No posts found.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredPosts.map(
              (post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}
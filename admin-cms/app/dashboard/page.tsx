"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Post = {
  id: string;

  title: string;

  slug: string;

  category: string;

  subcategory: string;

  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<
    Post[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    checkUser();

    fetchPosts();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
    }
  };

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

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const query =
        search.toLowerCase();

      return (
        post.title
          .toLowerCase()
          .includes(query) ||
        post.category
          .toLowerCase()
          .includes(query) ||
        post.subcategory
          .toLowerCase()
          .includes(query)
      );
    });
  }, [posts, search]);

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/");
  };

  const handleDelete = async (
    id: string
  ) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmDelete) return;

    const { error } =
      await supabase
        .from("posts")
        .delete()
        .eq("id", id);

    if (error) {
      alert(
        "Failed to delete post"
      );

      return;
    }

    setPosts(
      posts.filter(
        (post) => post.id !== id
      )
    );

    alert(
      "Post deleted successfully"
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">
            Admin CMS
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                router.push(
                  "/editor/new"
                )
              }
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
            >
              New Post
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-4xl font-bold">
            Dashboard
          </h2>

          <p className="mt-2 text-zinc-400">
            Manage your blog posts
          </p>
        </div>

        <div className="sticky top-[88px] z-40 mb-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur">
          <input
            type="text"
            placeholder="Search posts by title, category or subcategory..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-zinc-600"
          />
        </div>

        {loading ? (
          <div className="text-zinc-400">
            Loading posts...
          </div>
        ) : filteredPosts.length ===
          0 ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-10 text-center">
            <h3 className="text-2xl font-semibold">
              No posts found
            </h3>

            <p className="mt-2 text-zinc-400">
              Create your first blog
              post
            </p>

            <button
              onClick={() =>
                router.push(
                  "/editor/new"
                )
              }
              className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredPosts.map(
              (post) => (
                <div
                  key={post.id}
                  className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-700"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-2xl font-semibold">
                        {post.title}
                      </h3>

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-300">
                          {
                            post.category
                          }
                        </span>

                        <span className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-zinc-300">
                          {
                            post.subcategory
                          }
                        </span>

                        <span className="text-zinc-500">
                          {new Date(
                            post.created_at
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          router.push(
                            `/editor/${post.slug}`
                          )
                        }
                        className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            post.id
                          )
                        }
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}
"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { Post } from "@/types/post";

type NavbarProps = {
  posts: Post[];
};

export default function Navbar({
  posts,
}: NavbarProps) {
  const pathname =
    usePathname();

  const [search, setSearch] =
    useState("");

  const [focused, setFocused] =
    useState(false);

  const filteredPosts = useMemo(() => {
    if (!search.trim())
      return [];

    return posts
      .filter((post) => {
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
      })
      .slice(0, 8);
  }, [posts, search]);

  useEffect(() => {
    const handleClickOutside = (
      e: MouseEvent
    ) => {
      const target =
        e.target as HTMLElement;

      if (
        !target.closest(
          ".search-wrapper"
        )
      ) {
        setFocused(false);
      }
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          className="shrink-0 text-2xl font-bold tracking-tight"
        >
          {pathname === "/"
            ? "Posts"
            : "Home"}
        </Link>

        <div className="search-wrapper relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            onFocus={() =>
              setFocused(true)
            }
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-3 text-white outline-none transition focus:border-zinc-500"
          />

          {focused &&
            search.trim() &&
            filteredPosts.length >
              0 && (
              <div className="absolute top-full mt-3 w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
                {filteredPosts.map(
                  (post) => (
                    <Link
                      key={post.id}
                      href={`/${post.slug}`}
                      onClick={() =>
                        setFocused(
                          false
                        )
                      }
                      className="block border-b border-zinc-800 px-5 py-4 transition hover:bg-zinc-800"
                    >
                      <div className="truncate font-medium">
                        {
                          post.title
                        }
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                        <span>
                          {
                            post.category
                          }
                        </span>

                        <span>
                          •
                        </span>

                        <span>
                          {
                            post.subcategory
                          }
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>
            )}

          {focused &&
            search.trim() &&
            filteredPosts.length ===
              0 && (
              <div className="absolute top-full mt-3 w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-500 shadow-2xl">
                No posts found.
              </div>
            )}
        </div>
      </div>
    </header>
  );
}
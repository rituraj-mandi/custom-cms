"use client";

import Editor from "@/components/Editor";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import slugify from "slugify";

import { categories } from "@/lib/constants"


export default function NewPostPage() {
  const router = useRouter();

  const editorRef = useRef<any>(null);

  const uploadedFilesRef = useRef<
    string[]
  >([]);

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("Option 1");

  const [subcategory, setSubcategory] =
    useState("Sub-option 1");

  const [loading, setLoading] =
    useState(false);

  const [
    hasUnsavedChanges,
    setHasUnsavedChanges,
  ] = useState(false);

  useEffect(() => {
    checkUser();

    return () => {
      editorRef.current?.destroy();

      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (
      e: BeforeUnloadEvent
    ) => {
      if (!hasUnsavedChanges)
        return;

      e.preventDefault();

      e.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [hasUnsavedChanges]);

  const cleanupUploadedFiles =
    async () => {
      if (
        uploadedFilesRef.current
          .length === 0
      )
        return;

      await supabase.storage
        .from("media")
        .remove(
          uploadedFilesRef.current
        );
    };

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
    }
  };

  const handleCreatePost =
    async () => {
      if (!editorRef.current)
        return;

      if (!title.trim()) {
        alert(
          "Please enter a title"
        );

        return;
      }

      setLoading(true);

      const outputData =
        await editorRef.current.save();

      const slug = slugify(title, {
        lower: true,
        strict: true,
      });

      const { error } = await supabase
        .from("posts")
        .insert([
          {
            title,

            slug,

            category,

            subcategory,

            content: outputData,
          },
        ]);

      setLoading(false);

      if (error) {
        alert(error.message);

        return;
      }

      setHasUnsavedChanges(false);

      uploadedFilesRef.current = [];

      alert(
        "Post created successfully"
      );

      router.push("/dashboard");
    };

  const handleLogout = async () => {
    if (hasUnsavedChanges) {
      const discard = confirm(
        "You have unsaved changes. Discard post and delete uploaded media?"
      );

      if (!discard) return;

      await cleanupUploadedFiles();
    }

    await supabase.auth.signOut();

    router.push("/");
  };

  const handleDashboardNavigation =
    async () => {
      if (hasUnsavedChanges) {
        const discard = confirm(
          "You have unsaved changes. Discard post and delete uploaded media?"
        );

        if (!discard) return;

        await cleanupUploadedFiles();
      }

      router.push("/dashboard");
    };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">
            Create Post
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={
                handleDashboardNavigation
              }
              className="rounded-xl border border-zinc-700 px-4 py-2 text-sm transition hover:bg-zinc-800"
            >
              Manage Posts
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

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <label className="mb-2 block text-sm text-zinc-400">
            Title
          </label>

          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => {
              setTitle(
                e.target.value
              );

              setHasUnsavedChanges(
                true
              );
            }}
            className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-600"
          />
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => {
                const selected =
                  e.target.value;

                setCategory(selected);

                setSubcategory(
                  categories[
                    selected as keyof typeof categories
                  ][0]
                );

                setHasUnsavedChanges(
                  true
                );
              }}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-600"
            >
              {Object.keys(
                categories
              ).map((cat) => (
                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Subcategory
            </label>

            <select
              value={subcategory}
              onChange={(e) => {
                setSubcategory(
                  e.target.value
                );

                setHasUnsavedChanges(
                  true
                );
              }}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-zinc-600"
            >
              {categories[
                category as keyof typeof categories
              ].map((sub) => (
                <option
                  key={sub}
                  value={sub}
                >
                  {sub}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <Editor
  editorRef={editorRef}
  uploadedFilesRef={uploadedFilesRef}
  onChange={() => {
    setHasUnsavedChanges(true);
  }}
/>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={
              handleCreatePost
            }
            disabled={loading}
            className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Publishing..."
              : "Publish Post"}
          </button>
        </div>
      </section>
    </main>
  );
}
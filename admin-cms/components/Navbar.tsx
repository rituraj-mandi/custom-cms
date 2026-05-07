"use client";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Props = {
  title?: string;
};

export default function Navbar({
  title = "Admin CMS",
}: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/");
  };

  return (
    <nav className="border-b border-zinc-800 bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              router.push("/editor/new")
            }
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
          >
            New Post
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
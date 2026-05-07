"use client";

import { useEffect, useRef } from "react";

import { supabase } from "@/lib/supabase";

type Props = {
  data?: any;
  onChange?: (data: any) => void;
};

export default function Editor({
  data,
  onChange,
}: Props) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const initEditor = async () => {
      const EditorJS = (
        await import("@editorjs/editorjs")
      ).default;

      const Header = (
        await import("@editorjs/header")
      ).default;

      const List = (
        await import("@editorjs/list")
      ).default;

      const Paragraph = (
        await import("@editorjs/paragraph")
      ).default;

      const ImageTool = (
        await import("@editorjs/image")
      ).default;

      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: "editorjs",

          data,

          placeholder:
            "Write your blog post here...",

          async onChange(api) {
            const savedData = await api.saver.save();

            onChange?.(savedData);
          },

          tools: {
            header: Header,

            list: List,

            paragraph: Paragraph,

            image: {
              class: ImageTool,

              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    const fileExt = file.name
                      .split(".")
                      .pop();

                    const fileName = `${Date.now()}-${Math.random()
                      .toString(36)
                      .substring(2)}.${fileExt}`;

                    const { error } =
                      await supabase.storage
                        .from("media")
                        .upload(fileName, file);

                    if (error) {
                      throw new Error(
                        "Image upload failed"
                      );
                    }

                    const { data } =
                      supabase.storage
                        .from("media")
                        .getPublicUrl(fileName);

                    return {
                      success: 1,

                      file: {
                        url: data.publicUrl,
                      },
                    };
                  },
                },
              },
            },
          },
        });

        editorRef.current = editor;
      }
    };

    initEditor();

    return () => {
      editorRef.current?.destroy();

      editorRef.current = null;
    };
  }, []);

  return (
    <div
      id="editorjs"
      className="prose prose-invert max-w-none"
    />
  );
}
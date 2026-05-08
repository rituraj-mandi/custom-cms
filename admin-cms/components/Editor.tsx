"use client";

import {
  useEffect,
  useRef,
} from "react";

import { supabase } from "@/lib/supabase";

import VideoTool from "@/components/VideoTool";
import AudioTool from "@/components/AudioTool";

type Props = {
  data?: any;

  onChange?: () => void;

  uploadedFilesRef: React.MutableRefObject<
    string[]
  >;

  editorRef: React.MutableRefObject<any>;
};

export default function Editor({
  data,

  onChange,

  uploadedFilesRef,

  editorRef,
}: Props) {
  const holderRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    initEditor();

    return () => {
      editorRef.current?.destroy();

      editorRef.current = null;
    };
  }, []);

  const initEditor = async () => {
    if (
      !holderRef.current ||
      editorRef.current
    )
      return;

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

    const Embed = (
      await import("@editorjs/embed")
    ).default;

    const CodeTool = (
      await import("@editorjs/code")
    ).default;

    const Table = (
      await import("@editorjs/table")
    ).default;

    const Quote = (
      await import("@editorjs/quote")
    ).default;

    const Delimiter = (
      await import("@editorjs/delimiter")
    ).default;

    const Checklist = (
      await import("@editorjs/checklist")
    ).default;

    const Warning = (
      await import("@editorjs/warning")
    ).default;

    const Raw = (
      await import("@editorjs/raw")
    ).default;

    const Marker = (
      await import("@editorjs/marker")
    ).default;

    const Carousel = (
      await import(
        "editorjs-carousel"
      )
    ).default;

    const MermaidTool = (
      await import(
        "editorjs-mermaid"
      )
    ).default;

    const editor = new EditorJS({
      holder: holderRef.current,

      data:
        data &&
        typeof data ===
          "object" &&
        Array.isArray(data.blocks)
          ? {
              time:
                data.time ||
                Date.now(),

              blocks:
                data.blocks.filter(
                  (block: any) =>
                    block &&
                    block.type &&
                    block.data
                ),

              version:
                data.version ||
                "2.31.6",
            }
          : {
              time: Date.now(),

              blocks: [],

              version: "2.31.6",
            },

      placeholder:
        "Write your blog post here...",

      async onChange() {
        onChange?.();
      },

      tools: {
        header: Header,

        paragraph: {
          class: Paragraph,

          inlineToolbar: true,
        },

        list: {
          class: List,

          inlineToolbar: true,
        },

        embed: {
          class: Embed,

          inlineToolbar: false,

          config: {
            services: {
              youtube: true,

              coub: true,

              codepen: true,

              instagram: true,

              twitter: true,

              github: true,

              reddit: true,

              twitch: true,

              vimeo: true,
            },
          },
        },

        code: CodeTool,

        table: Table,

        quote: Quote,

        delimiter: Delimiter,

        checklist: Checklist,

        warning: Warning,

        raw: Raw,

        Marker: Marker,

        carousel: {
          class: Carousel,

          config: {
            uploader: {
              async uploadByFile(
                file: File
              ) {
                const fileExt =
                  file.name
                    .split(".")
                    .pop();

                const fileName = `carousel/${Date.now()}-${Math.random()
                  .toString(36)
                  .substring(2)}.${fileExt}`;

                const { error } =
                  await supabase.storage
                    .from("media")
                    .upload(
                      fileName,
                      file
                    );

                if (error) {
                  throw new Error(
                    error.message
                  );
                }

                uploadedFilesRef.current.push(
                  fileName
                );

                const { data } =
                  supabase.storage
                    .from("media")
                    .getPublicUrl(
                      fileName
                    );

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

        mermaid: {
          class: MermaidTool,
        },

        image: {
          class: ImageTool,

          config: {
            uploader: {
              async uploadByFile(
                file: File
              ) {
                const fileExt =
                  file.name
                    .split(".")
                    .pop();

                const fileName = `uploads/${Date.now()}.${fileExt}`;

                const { error } =
                  await supabase.storage
                    .from("media")
                    .upload(
                      fileName,
                      file
                    );

                if (error) {
                  throw new Error(
                    error.message
                  );
                }

                uploadedFilesRef.current.push(
                  fileName
                );

                const { data } =
                  supabase.storage
                    .from("media")
                    .getPublicUrl(
                      fileName
                    );

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

        video: {
          class: VideoTool,

          config: {
            onUpload: (
              fileName: string
            ) => {
              uploadedFilesRef.current.push(
                fileName
              );
            },
          },
        },

        audio: {
          class: AudioTool,

          config: {
            onUpload: (
              fileName: string
            ) => {
              uploadedFilesRef.current.push(
                fileName
              );
            },
          },
        },
      },
    });

    editorRef.current = editor;
  };

  return (
    <div
      ref={holderRef}
      className="min-h-[300px]"
    />
  );
}
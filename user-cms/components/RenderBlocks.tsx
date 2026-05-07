"use client";

import Image from "next/image";

import mermaid from "mermaid";

import katex from "katex";

import { useEffect } from "react";

export default function RenderBlocks({
  blocks,
}: {
  blocks: any[];
}) {
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,

      theme: "dark",
    });

    mermaid.run();
  }, [blocks]);

  return (
    <div className="space-y-8">
      {blocks.map(
        (block, index) => {
          switch (block.type) {
            case "paragraph":
              return (
                <p
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html:
                      block.data.text,
                  }}
                  className="text-lg leading-8 text-zinc-200"
                />
              );

            case "header":
              const level =
                block.data.level || 2;

              const HeaderTag =
                `h${level}` as keyof JSX.IntrinsicElements;

              return (
                <HeaderTag
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html:
                      block.data.text,
                  }}
                  className={`font-bold leading-tight ${
                    level === 1
                      ? "text-5xl"
                      : level === 2
                      ? "text-4xl"
                      : level === 3
                      ? "text-3xl"
                      : "text-2xl"
                  }`}
                />
              );

            case "image":
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-zinc-800"
                >
                  <Image
                    src={
                      block.data.file
                        .url
                    }
                    alt=""
                    width={1400}
                    height={900}
                    className="h-auto w-full object-cover"
                  />
                </div>
              );

            case "video":
              return (
                <video
                  key={index}
                  controls
                  className="w-full rounded-3xl border border-zinc-800"
                >
                  <source
                    src={
                      block.data.url
                    }
                  />
                </video>
              );

            case "audio":
              return (
                <audio
                  key={index}
                  controls
                  className="w-full"
                >
                  <source
                    src={
                      block.data.url
                    }
                  />
                </audio>
              );

            case "list":
              const style =
                block.data.style;

              if (
                style ===
                "ordered"
              ) {
                return (
                  <ol
                    key={index}
                    className="list-decimal space-y-2 pl-6 text-lg text-zinc-200"
                  >
                    {block.data.items.map(
                      (
                        item: string,
                        i: number
                      ) => (
                        <li
                          key={i}
                          dangerouslySetInnerHTML={{
                            __html:
                              item,
                          }}
                        />
                      )
                    )}
                  </ol>
                );
              }

              return (
                <ul
                  key={index}
                  className="list-disc space-y-2 pl-6 text-lg text-zinc-200"
                >
                  {block.data.items.map(
                    (
                      item: string,
                      i: number
                    ) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html:
                            item,
                        }}
                      />
                    )
                  )}
                </ul>
              );

            case "quote":
              return (
                <blockquote
                  key={index}
                  className="rounded-3xl border-l-4 border-zinc-600 bg-zinc-900 p-6 text-xl italic text-zinc-300"
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        block.data.text,
                    }}
                  />

                  {block.data.caption && (
                    <div className="mt-4 text-sm text-zinc-500">
                      —
                      {
                        block.data
                          .caption
                      }
                    </div>
                  )}
                </blockquote>
              );

            case "code":
              return (
                <pre
                  key={index}
                  className="overflow-x-auto rounded-3xl border border-zinc-800 bg-black p-6 text-sm text-zinc-100"
                >
                  <code>
                    {
                      block.data.code
                    }
                  </code>
                </pre>
              );

            case "table":
              return (
                <div
                  key={index}
                  className="overflow-x-auto rounded-3xl border border-zinc-800"
                >
                  <table className="min-w-full border-collapse">
                    <tbody>
                      {block.data.content.map(
                        (
                          row: string[],
                          rowIndex: number
                        ) => (
                          <tr
                            key={
                              rowIndex
                            }
                            className="border-b border-zinc-800"
                          >
                            {row.map(
                              (
                                cell,
                                cellIndex
                              ) => (
                                <td
                                  key={
                                    cellIndex
                                  }
                                  className="border-r border-zinc-800 px-4 py-3 text-zinc-200"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      cell,
                                  }}
                                />
                              )
                            )}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              );

            case "delimiter":
              return (
                <div
                  key={index}
                  className="flex items-center justify-center py-4"
                >
                  <div className="h-[2px] w-32 bg-zinc-700" />
                </div>
              );

            case "warning":
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-yellow-500/30 bg-yellow-500/10 p-6"
                >
                  <h3 className="mb-3 text-xl font-bold text-yellow-300">
                    {
                      block.data
                        .title
                    }
                  </h3>

                  <p className="text-yellow-100">
                    {
                      block.data
                        .message
                    }
                  </p>
                </div>
              );

            case "checklist":
              return (
                <div
                  key={index}
                  className="space-y-3"
                >
                  {block.data.items.map(
                    (
                      item: any,
                      i: number
                    ) => (
                      <div
                        key={i}
                        className="flex items-start gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={
                            item.checked
                          }
                          readOnly
                          className="mt-1"
                        />

                        <div
                          dangerouslySetInnerHTML={{
                            __html:
                              item.text,
                          }}
                          className="text-zinc-200"
                        />
                      </div>
                    )
                  )}
                </div>
              );

            case "embed":
              return (
                <div
                  key={index}
                  className="overflow-hidden rounded-3xl border border-zinc-800"
                >
                  <iframe
                    src={
                      block.data.embed
                    }
                    allowFullScreen
                    className="h-[500px] w-full"
                  />
                </div>
              );

            case "math":
              return (
                <div
                  key={index}
                  className="overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
                  dangerouslySetInnerHTML={{
                    __html:
                      katex.renderToString(
                        block.data.text ||
                          "",
                        {
                          throwOnError:
                            false,

                          displayMode: true,
                        }
                      ),
                  }}
                />
              );

            case "mermaid":
              return (
                <div
                  key={index}
                  className="mermaid overflow-x-auto rounded-3xl border border-zinc-800 bg-zinc-900 p-6"
                >
                  {
                    block.data.code
                  }
                </div>
              );

            case "raw":
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{
                    __html:
                      block.data.html,
                  }}
                />
              );

            case "flipbox":
              return (
                <div
                  key={index}
                  className="group perspective"
                >
                  <div className="relative min-h-[220px] rounded-3xl border border-zinc-800 bg-zinc-900 p-6 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-2xl font-bold [backface-visibility:hidden]">
                      {
                        block.data
                          .front
                      }
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-lg text-zinc-300 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                      {
                        block.data
                          .back
                      }
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        }
      )}
    </div>
  );
}
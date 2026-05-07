import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const fileExt = file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    const fileBuffer = await file.arrayBuffer();

    const { error } = await supabase.storage
      .from("media")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    const { data } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,

      url: data.publicUrl,

      fileName,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "File upload failed",
      },
      {
        status: 500,
      }
    );
  }
}
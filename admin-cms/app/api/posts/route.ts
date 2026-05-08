import { NextResponse } from "next/server"

import { supabase } from "@/lib/supabase"
import { requireUser } from "@/lib/auth"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false,
      })

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(req: Request) {
  try {
    await requireUser()

    const body = await req.json()

    const {
      title,
      slug,
      category,
      subcategory,
      content,
    } = body

    if (!title || !slug || !content) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      )
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title,
          slug,
          category,
          subcategory,
          content,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }
}

export async function PUT(req: Request) {
  try {
    await requireUser()

    const body = await req.json()

    const {
      id,
      title,
      slug,
      category,
      subcategory,
      content,
    } = body

    if (!id) {
      return NextResponse.json(
        {
          error: "Post ID required",
        },
        {
          status: 400,
        }
      )
    }

    const { data, error } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        category,
        subcategory,
        content,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    await requireUser()

    const body = await req.json()

    const { id } = body

    if (!id) {
      return NextResponse.json(
        {
          error: "Post ID required",
        },
        {
          status: 400,
        }
      )
    }

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      )
    }

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }
}
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation endpoint for Strapi Webhooks & manual cache purge
 *
 * Examples:
 * POST https://kidsfoundation.globizsapp.com/api/revalidate?path=/learning
 * POST https://kidsfoundation.globizsapp.com/api/revalidate?path=/
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");

  // Verify secret token if REVALIDATION_TOKEN is set in environment
  const expectedSecret = process.env.REVALIDATION_TOKEN;
  if (expectedSecret && secret !== expectedSecret) {
    return NextResponse.json(
      { message: "Invalid secret token" },
      { status: 401 }
    );
  }

  try {
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        revalidated: true,
        path,
        timestamp: Date.now(),
      });
    }

    // If triggered by a generic Strapi webhook (no query param)
    const body = await request.json().catch(() => null);
    const model = body?.model; // e.g. "learning-page", "home-page", "events-page"

    if (model) {
      const targetPath =
        model === "home-page" ? "/" : `/${model.replace(/-page$/, "")}`;
      revalidatePath(targetPath);
      revalidatePath("/"); // Also revalidate homepage as it shares stage/news data
      return NextResponse.json({
        revalidated: true,
        model,
        targetPath,
        timestamp: Date.now(),
      });
    }

    // Default: revalidate learning and homepage
    revalidatePath("/learning");
    revalidatePath("/");

    return NextResponse.json({
      revalidated: true,
      path: "all",
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error revalidating", error: error?.message },
      { status: 500 }
    );
  }
}

// Allow GET for easy testing in browser: /api/revalidate?path=/learning
export async function GET(request: NextRequest) {
  return POST(request);
}

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "211206dD3";

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Password salah" }, { status: 401 });
  } catch (err) {
    console.error("Auth API error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

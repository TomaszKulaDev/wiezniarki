import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    components: {
      navbar: "should be visible",
      footer: "should be visible",
    },
  });
}

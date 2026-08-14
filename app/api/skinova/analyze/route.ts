import { NextResponse } from "next/server";
import { analysisResult } from "../../../lib/skinova-data";

export async function POST() {
  return NextResponse.json({
    status: "ready",
    message: "Skinova is ready.",
    analysis: analysisResult
  });
}

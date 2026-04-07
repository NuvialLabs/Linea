import { storage } from "./_kv";
import { StatusCodes } from "http-status-codes";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const { id } = params;
  const data = await storage.get(`timeline:${id}`);

  if (!data)
    return NextResponse.json(
      { error: "Not found" },
      { status: StatusCodes.NOT_FOUND },
    );

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { data } = await request.json();
  const dataId = crypto.randomUUID();

  await storage.set(`timeline:${dataId}`, data);

  return NextResponse.json({ id: dataId });
}

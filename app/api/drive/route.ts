import { getServerSession } from "next-auth/next";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { StatusCodes } from "http-status-codes";
import { authOptions } from "../auth/[...nextauth]/route";
import { Readable } from "stream";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      console.warn("No access token found");
      return new NextResponse("Unauthorized", {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: "v3", auth });

    const list = await drive.files.list({
      q: `name = '${env.driveFileName}.json' and trashed = false`,
      fields: "files(id, modifiedTime)",
    });

    const file = list.data.files?.[0];

    if (!file || !file.id) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    const response = await drive.files.get({
      fileId: file.id,
      alt: "media",
    });

    console.info("Response data retrieved");
    return NextResponse.json({
      data: response.data,
      lastUpdated: file.modifiedTime,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
      console.warn("No access token found");
      return new NextResponse("Unauthorized", {
        status: StatusCodes.UNAUTHORIZED,
      });
    }

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session.accessToken });

    const drive = google.drive({ version: "v3", auth });

    const list = await drive.files.list({
      q: `name = '${env.driveFileName}.json' and trashed = false`,
      fields: "files(id)",
    });

    const existingFileId = list.data.files?.[0]?.id;
    let res;

    if (existingFileId) {
      res = await drive.files.update({
        fileId: existingFileId,
        media: {
          mimeType: "application/json",
          body: Readable.from([JSON.stringify(body)]),
        },
        fields: "id, modifiedTime",
      });
    } else {
      res = await drive.files.create({
        requestBody: {
          name: `${env.driveFileName}.json`,
          mimeType: "application/json",
        },
        media: {
          mimeType: "application/json",
          body: Readable.from([JSON.stringify(body)]),
        },
        fields: "modifiedTime",
      });
    }

    return NextResponse.json(res.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session?.accessToken });
    const drive = google.drive({ version: "v3", auth });

    const list = await drive.files.list({
      q: `name = '${env.driveFileName}.json' and trashed = false`,
      fields: "files(id)",
    });

    const fileId = list.data.files?.[0]?.id;

    if (!fileId) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    await drive.files.update({
      fileId: fileId,
      requestBody: { trashed: true },
    });

    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

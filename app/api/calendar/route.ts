import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { StatusCodes } from "http-status-codes";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    console.warn("Unauthorized");
    return new Response("Unauthorized", { status: StatusCodes.UNAUTHORIZED });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: session.accessToken });

  const calendar = google.calendar({ version: "v3", auth });

  try {
    const { data } = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date(
        new Date().setFullYear(new Date().getFullYear() - 5),
      ).toISOString(),
      timeMax: new Date(
        new Date().setFullYear(new Date().getFullYear() + 5),
      ).toISOString(),
      maxResults: 2500,
      singleEvents: true,
      orderBy: "startTime",
    });

    return Response.json(data.items);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch" },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

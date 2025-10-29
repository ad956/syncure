import mongoose from "mongoose";
import { getSession } from "@lib/auth/get-session";
import dbConfig from "@utils/db";
import { createSuccessResponse, createErrorResponse } from "@lib/api-response";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  try {
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const session = await getSession();

    if (!session?.user?.id) {
      return createErrorResponse("Unauthorized", 401);
    }

    await dbConfig();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const collections = ["hospital", "patient", "doctor", "receptionist"];
    let allNewUsers: RecentUserTile[] = [];

    for (const collection of collections) {
      const users = await mongoose.connection.db
        .collection(collection)
        .find<RecentUserTile>(
          { createdAt: { $gte: oneMonthAgo } },
          {
            projection: {
              firstname: 1,
              createdAt: 1,
              type: { $literal: collection },
            },
          }
        )
        .toArray();

      allNewUsers = allNewUsers.concat(users);
    }

    // Sort all users by createdAt in descending order
    allNewUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const totalItems = allNewUsers.length;
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;

    const paginatedUsers: FormattedRecentUser[] = allNewUsers
      .slice(skip, skip + limit)
      .map((user) => {
        const timeSince = getTimeSince(user.createdAt);
        const typeMap: { [key: string]: string } = {
          hospital: "Hospital",
          patient: "Patient",
          doctor: "Doctor",
          receptionist: "Receptionist",
        };
        return {
          title: `New ${typeMap[user.type]} Registered`,
          description: `${user.firstname} registered as a new ${user.type}.`,
          timeSince: timeSince,
        };
      });

    const response: RecentUserPaginatedResponse = {
      users: paginatedUsers,
      page,
      totalPages,
      totalItems,
    };

    return createSuccessResponse(response);
  } catch (error: any) {
    console.error("Error fetching recent users:", { error: error.message });
    return createErrorResponse("Failed to fetch recent users", 500);
  }
}

function getTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
}


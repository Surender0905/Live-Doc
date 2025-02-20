/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import liveblocks from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    console.log(userIds, "userIds------");
    try {
        const clerk = await clerkClient();
        // console.log(clerk, "clerk");
        const { data } = await clerk.users.getUserList({
            userIds: userIds,
        } as any);
        // console.log(data, "data");

        const users = data.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) =>
            users.find((user: any) => user.email === email),
        );

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
    }
};

export const getDocumentUsers = async ({
    roomId,
    currentUser,
    text,
}: {
    roomId: string;
    currentUser: string;
    text: string;
}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        const users = Object.keys(room.usersAccesses).filter(
            (email) => email !== currentUser,
        );

        if (text.length) {
            const lowerCaseText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) =>
                email.toLowerCase().includes(lowerCaseText),
            );

            return parseStringify(filteredUsers);
        }

        return parseStringify(users);
    } catch (error) {
        console.log(`Error fetching document users: ${error}`);
    }
};

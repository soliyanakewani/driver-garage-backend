import { AccountStatus } from "@prisma/client";
export interface Post {
    id: string;
    title: string;
    authorId: string;
    imageUrl?: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

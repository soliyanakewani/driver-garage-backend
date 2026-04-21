export interface CreatePostDto {
    title?: string;
    content: string;
    /** @deprecated Prefer imageUrls */
    imageUrl?: string;
    imageUrls?: string[];
    authorId: string;
}

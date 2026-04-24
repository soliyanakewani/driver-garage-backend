export interface CreatePostDto {
    title?: string;
    content: string;
    /** @deprecated Prefer imageUrls */
    imageUrls?: string[];
    authorId: string;
}

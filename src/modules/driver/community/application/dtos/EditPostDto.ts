export interface EditPostDto {
    postId: string;
    title?: string;
    content?: string;
    authorId?: string;
    /** @deprecated Prefer imageUrls */
    imageUrl?: string;
    imageUrls?: string[];
}

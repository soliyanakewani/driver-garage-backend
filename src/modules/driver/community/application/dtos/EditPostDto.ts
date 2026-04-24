export interface EditPostDto {
    postId: string;
    title?: string;
    content?: string;
    authorId?: string;
    /** @deprecated Prefer imageUrls */
    imageUrl?: string;
    /** Preferred input for multiple images */
    imageUrls?: string[];
}

export interface CreatePostDto {
    title?: string;
    content: string;
    /** @deprecated Prefer imageUrls */
    imageUrl?: string;
    /** Preferred input for multiple images */
    imageUrls?: string[];
    authorId: string;
}

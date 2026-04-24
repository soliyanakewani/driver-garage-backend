export interface CreatePostDto {
    title: string;
    content: string;
<<<<<<< Updated upstream
    imageUrl?: string;
=======
    /** @deprecated Prefer imageUrls */
    imageUrls?: string[];
>>>>>>> Stashed changes
    authorId: string;
}
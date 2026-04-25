import { PostRepository } from "../../domain/repositories/PostRepository";
import { ReportPostDto } from "../dtos/ReportPostDto";

const ALLOWED_REPORT_REASONS = new Set([
    "SPAM",
    "HARASSMENT",
    "HATE_SPEECH",
    "FALSE_INFORMATION",
    "VIOLENCE",
    "NUDITY_OR_SEXUAL_CONTENT",
    "SCAM_OR_FRAUD",
    "OTHER",
]);

export class ReportPostUseCase {
    constructor(private readonly repository: PostRepository) {}

    async execute(dto: ReportPostDto) {
        const normalizedReason = dto.reason?.trim().toUpperCase();
        if (!dto.postId || !dto.reporterId || !normalizedReason) {
            throw new Error("postId, reporterId and reason are required");
        }
        if (!ALLOWED_REPORT_REASONS.has(normalizedReason)) {
            throw new Error(`Invalid reason. Allowed: ${Array.from(ALLOWED_REPORT_REASONS).join(", ")}`);
        }
        return this.repository.reportPost(
            dto.postId,
            dto.reporterId,
            normalizedReason,
            dto.details?.trim() || undefined
        );
    }
}

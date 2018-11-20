export interface SupportRequest {
    name: string;
    email: string;
    subject: string;
    reason: string;
    description: string;
    itemId?: number;
    contentReason?: string;
}
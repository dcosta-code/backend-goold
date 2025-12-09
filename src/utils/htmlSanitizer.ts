import { AppError } from "./AppError";

export const htmlSanitizer = {
  containsJavaScript(html: string): boolean {
    const patterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /data:application\/javascript/gi,
      /vbscript:/gi,
    ];
    return patterns.some((pattern) => pattern.test(html));
  },

  validate(html: string): void {
    if (this.containsJavaScript(html)) {
      throw AppError.badRequest("HTML content cannot contain JavaScript code");
    }
  },
};

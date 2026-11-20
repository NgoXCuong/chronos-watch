import { randomUUID } from "node:crypto";

// Unique index trong DB bảo vệ cả các request đồng thời.
export const generateSku = () => `CW-${randomUUID().replaceAll("-", "").toUpperCase()}`;

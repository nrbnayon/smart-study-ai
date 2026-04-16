import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number = 100): string {
  if (!text || typeof text !== "string") return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export const resolveMediaUrl = (url?: string | null) => {
  if (!url) return "";
  
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:5000";
  
  // If it's already a full external URL, a blob URL, or a data URI, return as is
  // But if it contains localhost:5000, we still want to replace it with mediaBase
  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("localhost:5000")) {
      return url.replace(/^https?:\/\/localhost:5000/, mediaBase);
    }
    return url;
  }

  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url;
  }

  // For relative paths, prepend the media base URL
  const separator = url.startsWith("/") ? "" : "/";
  return `${mediaBase}${separator}${url}`;
};

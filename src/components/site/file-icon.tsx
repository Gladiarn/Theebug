import { FileCode2, FileText } from "lucide-react";

export function FileIcon({ lang, className }: { lang: string; className?: string }) {
  const Icon = lang === "Markdown" ? FileText : FileCode2;
  return <Icon className={className} />;
}

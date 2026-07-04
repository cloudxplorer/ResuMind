
"use client";

import * as React from "react";
import { Upload, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ResumeData } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  
  onStructured: (data: ResumeData, text: string) => void;
  label?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  
  structure?: boolean;
}


export function PdfUploadButton({
  onStructured,
  label = "Upload PDF",
  variant = "outline",
  size = "sm",
  className,
  structure = true,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large (max 5 MB)");
      return;
    }

    setLoading(true);
    
    const t = toast.loading(`Extracting "${file.name}"…`);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("structure", String(structure));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(text.slice(0, 200) || `Server returned ${res.status}`);
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (structure && !data.structured) {
        toast.dismiss(t);
        toast.error(data.warning || "Extracted text but could not structure — try again or edit manually.");
        return;
      }

      toast.dismiss(t);
      if (structure && data.structured) {
        const name = data.structured.contact?.name || file.name.replace(/\.pdf$/i, "");
        toast.success(`Imported "${name}" from PDF`);
        onStructured(data.structured as ResumeData, data.text as string);
      } else {
        toast.success(`Extracted ${data.chars} characters from PDF`);
        onStructured({} as ResumeData, data.text as string);
      }
    } catch (e) {
      toast.dismiss(t);
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      <Button
        variant={variant}
        size={size}
        className={cn("gap-1.5", className)}
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        title="Upload a resume PDF to import"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {label}
      </Button>
    </>
  );
}

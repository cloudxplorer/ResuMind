
"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportModal } from "@/components/export-modal";

interface Props {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
  className?: string;
}


export function ExportBar({ variant = "outline", size = "sm", label = "Download", className }: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setOpen(true)}>
        <Download className="h-4 w-4 mr-1.5" />
        {label}
      </Button>
      <ExportModal open={open} onOpenChange={setOpen} />
    </>
  );
}

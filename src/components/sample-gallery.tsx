
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Search, ArrowRight } from "lucide-react";
import { SAMPLE_RESUMES } from "@/lib/sample-resumes";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function SampleGallery({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { createResume, setActiveResume, setView } = useStore();
  const [query, setQuery] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("All");

  const categories = React.useMemo(() => {
    const set = new Set(SAMPLE_RESUMES.map((s) => s.category));
    return ["All", ...Array.from(set).sort()];
  }, []);

  const filtered = React.useMemo(() => {
    return SAMPLE_RESUMES.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesQuery = !query ||
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.description.toLowerCase().includes(query.toLowerCase()) ||
        s.data.contact.title.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  function loadSample(id: string) {
    const sample = SAMPLE_RESUMES.find((s) => s.id === id);
    if (!sample) return;
    const newId = createResume(sample.title, sample.data);
    setActiveResume(newId);
    onOpenChange(false);
    setView("builder");
    toast.success(`Loaded "${sample.title}" — edit it as your own`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><LayoutGrid className="h-5 w-5" /> Start from a template</DialogTitle>
          <DialogDescription>Pick a sample resume for your field and edit it with your own details. All templates are ATS-friendly.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by role, field, or title..."
              className="pl-9 h-9"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-y-auto scrollbar-thin flex-1 -mx-1 px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            {filtered.map((sample, i) => (
              <motion.button
                key={sample.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => loadSample(sample.id)}
                className="text-left p-4 rounded-lg border border-border hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">{sample.category}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" />
                </div>
                <p className="text-sm font-medium leading-tight">{sample.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{sample.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {sample.data.skills.slice(0, 2).flatMap((s) => s.items.slice(0, 2)).map((skill) => (
                    <span key={skill} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{skill}</span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No templates match your search.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

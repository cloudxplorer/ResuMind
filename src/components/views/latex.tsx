
"use client";

import * as React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Code2, Copy, Download, RefreshCw, Eye } from "lucide-react";
import { useStore } from "@/lib/store";
import { toLatex } from "@/lib/export";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { downloadFile } from "@/lib/export";

type Variant = "jake" | "moderncv" | "altacv";

export function LatexView() {
  const { activeResume } = useStore();
  const resume = activeResume();
  const { resolvedTheme } = useTheme();
  const [variant, setVariant] = React.useState<Variant>("jake");
  const [code, setCode] = React.useState("");
  const [tab, setTab] = React.useState<"code" | "preview">("code");

  React.useEffect(() => {
    setCode(toLatex(resume, variant));
  }, [resume, variant]);

  function copy() { navigator.clipboard.writeText(code); toast.success("LaTeX copied"); }
  function download() { downloadFile(`${resume.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.tex`, code, "application/x-tex"); toast.success("Downloaded .tex"); }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1300px] mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">LaTeX Studio</h1>
          <p className="text-muted-foreground text-sm mt-1">Overleaf-compatible LaTeX. Edit directly, choose a template variant, and export.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["jake", "moderncv", "altacv"] as const).map((v) => (
            <Button key={v} size="sm" variant={variant === v ? "default" : "outline"} onClick={() => setVariant(v)} className="capitalize">{v === "jake" ? "Jake's" : v === "moderncv" ? "ModernCV" : "AltaCV"}</Button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 lg:hidden">
        <Tabs value={tab} onValueChange={(v) => setTab(v as "code" | "preview")} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="code" className="flex-1"><Code2 className="h-3.5 w-3.5 mr-1.5" /> Code</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1"><Eye className="h-3.5 w-3.5 mr-1.5" /> Rendered</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {}
        <Card className={tab === "preview" ? "hidden lg:block" : ""}>
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm flex items-center gap-2"><Code2 className="h-4 w-4" /> source.tex</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setCode(toLatex(resume, variant)); toast.success("Regenerated from resume"); }} title="Regenerate"><RefreshCw className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copy} title="Copy"><Copy className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={download} title="Download"><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-[60vh] lg:h-[70vh] p-4 font-mono text-xs leading-relaxed bg-muted/30 resize-none focus:outline-none scrollbar-thin"
            />
          </CardContent>
        </Card>

        {}
        <Card className={tab === "code" ? "hidden lg:block" : ""}>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Syntax highlighted</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="h-[60vh] lg:h-[70vh] overflow-auto scrollbar-thin rounded-b-lg">
              <SyntaxHighlighter
                language="latex"
                style={resolvedTheme === "dark" ? oneDark : oneLight}
                customStyle={{ margin: 0, background: "transparent", fontSize: 12, padding: 16 }}
                showLineNumbers
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
          <p><span className="font-medium text-foreground">Compile on Overleaf:</span> create a new project, paste this into <code className="font-mono">main.tex</code>, set compiler to <span className="font-mono">pdfLaTeX</span> (Jake's) or <span className="font-mono">XeLaTeX</span> (ModernCV / AltaCV).</p>
          <p>Templates require their respective class files (ModernCV, AltaCV) — available in Overleaf's templates gallery.</p>
        </CardContent>
      </Card>
    </div>
  );
}

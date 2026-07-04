import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { access } from "node:fs/promises";
import type { PageSize } from "./export";

const IS_VERCEL = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);
const IS_PROD = process.env.NODE_ENV === "production";
const USE_SERVERLESS_CHROMIUM = IS_VERCEL || IS_PROD;

const LOCAL_CHROME_CANDIDATES = [
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

async function fileExists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function getLocalExecutablePath(): Promise<string | null> {
  const envPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH;
  if (envPath) return envPath;
  for (const candidate of LOCAL_CHROME_CANDIDATES) {
    if (await fileExists(candidate)) return candidate;
  }
  return null;
}

async function launchBrowser(): Promise<Browser> {
  if (USE_SERVERLESS_CHROMIUM) {
    return puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  }

  const localPath = await getLocalExecutablePath();
  if (localPath) {
    return puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      defaultViewport: { width: 1240, height: 1754 },
      executablePath: localPath,
      headless: true,
    });
  }

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
}

const PUPPETEER_FORMAT: Record<PageSize, "Letter" | "A4" | "Legal" | "A3" | "Tabloid"> = {
  letter: "Letter",
  a4: "A4",
  legal: "Legal",
  a3: "A3",
  tabloid: "Tabloid",
  executive: "Letter",
};

const CUSTOM_DIMENSIONS: Partial<Record<PageSize, { width: string; height: string }>> = {
  executive: { width: "7.25in", height: "10.5in" },
};

async function waitForFonts(page: import("puppeteer-core").Page): Promise<void> {
  try {
    await page.evaluate(() => (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready);
  } catch {}
  await new Promise((r) => setTimeout(r, 150));
}

async function renderPdf(page: import("puppeteer-core").Page, html: string, pageSize: PageSize): Promise<Buffer> {
  await page.setContent(html, { waitUntil: "load", timeout: 30000 });
  await waitForFonts(page);
  const custom = CUSTOM_DIMENSIONS[pageSize];
  const pdf = await page.pdf({
    ...(custom ? custom : { format: PUPPETEER_FORMAT[pageSize] }),
    printBackground: true,
    margin: { top: "0.5in", bottom: "0.5in", left: "0.5in", right: "0.5in" },
    preferCSSPageSize: true,
  });
  return Buffer.from(pdf);
}

let _devBrowser: Browser | null = null;

async function getDevBrowser(): Promise<Browser> {
  if (_devBrowser && _devBrowser.connected) return _devBrowser;
  _devBrowser = await launchBrowser();
  return _devBrowser;
}

export async function htmlToPdfBuffer(html: string, pageSize: PageSize = "letter"): Promise<Buffer> {
  if (USE_SERVERLESS_CHROMIUM) {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    try {
      return await renderPdf(page, html, pageSize);
    } finally {
      await page.close().catch(() => {});
      await browser.close().catch(() => {});
    }
  }

  const browser = await getDevBrowser();
  const page = await browser.newPage();
  try {
    return await renderPdf(page, html, pageSize);
  } finally {
    await page.close().catch(() => {});
  }
}

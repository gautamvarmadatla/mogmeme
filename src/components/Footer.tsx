import React from "react";
type SocialLink = { href: string; label: string; icon: React.ReactNode };
export default function Footer() {
  const socials: SocialLink[] = [
    { href: "https://example.com", label: "Website", icon: <GlobeIcon /> },
    { href: "https://discord.com", label: "Discord", icon: <DiscordIcon /> },
    { href: "https://x.com", label: "X", icon: <XIcon /> },
    { href: "https://t.me", label: "Telegram", icon: <TelegramIcon /> },
    { href: "https://youtube.com", label: "YouTube", icon: <YouTubeIcon /> },
  ];
  return (
    <footer className="bg-neutral-950 text-neutral-200 border-t border-neutral-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="text-center text-xs font-bold tracking-[0.35em] text-neutral-300 mb-4">KILLED BY</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 rounded border border-neutral-700 bg-neutral-900/60">
              <div className="h-14 w-14 shrink-0 rounded-l overflow-hidden bg-gradient-to-br from-red-600 to-blue-600">
                <img src="/mog-logo.jpg" alt="Avatar" className="h-full w-full object-contain p-1.5"/>
              </div>
              <div className="flex-1 py-3 pr-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-semibold text-sm md:text-base tracking-wide">[MOG]Mother of God</div>
                  <div className="flex items-center gap-1 text-neutral-300">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4"/>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded border border-neutral-700 bg-neutral-900/60 px-2 py-2">
            <div className="flex items-center justify-center gap-2">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                   className="inline-flex items-center justify-center h-10 w-10 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition">
                  <div className="h-5 w-5">{s.icon}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-6 text-center text-[10px] md:text-[11px] leading-relaxed tracking-[0.15em] text-neutral-400 uppercase">
         $MOG IS A CRYPTO ASSET WITH NO INTRINSIC VALUE OR EXPECTATION OF FINANCIAL RETURN. MOG COINS ARE TO BE USED FOR ENTERTAINMENT PURPOSES ONLY.
         THIS WEBSITE IS ENTIRELY FAN MADE AND IS ONLY TO BE USED FOR MEME GENERATION.
        </p>
      </div>
    </footer>
  );
}
function Star({ className = "" }) { return (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M12 2.5l2.9 6.1 6.7.9-4.9 4.7 1.2 6.7L12 17.8 6.1 21l1.2-6.7-4.9-4.7 6.7-.9L12 2.5z"/></svg>); }
function GlobeIcon(){ return (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.5 9h-3.1a14.7 14.7 0 00-1.2-5A8.02 8.02 0 0119.5 11zM12 4a12.9 12.9 0 011.9 6H10.1A12.9 12.9 0 0112 4zM4.5 11h3.1a14.7 14.7 0 011.2-5A8.02 8.02 0 004.5 11zM8.8 13H4.5a8.02 8.02 0 004.3 5 14.7 14.7 0 01-1.2-5zm3.2 7a12.9 12.9 0 01-1.9-6h3.8a12.9 12.9 0 01-1.9 6zm3.7-2a8.02 8.02 0 004.3-5h-3.1a14.7 14.7 0 01-1.2 5z"/></svg>); }
function DiscordIcon(){ return (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.7 5.3A16.3 16.3 0 0015.6 4l-.2.4a11 11 0 00-6.8 0L8.4 4A16.3 16.3 0 004.3 5.3 15 15 0 002 14.9c2.3 2 4.7 2.8 7 3l.7-1.5c-.4-.1-.9-.3-1.5-.6.1-.1.2-.1.3-.2a6.7 6.7 0 005.2 0l.3.2c-.6.3-1.1.5-1.5.6l.7 1.5c2.3-.3 4.7-1.1 7-3a15 15 0 00-2.3-9.6zM9.6 13.3c-.8 0-1.5-.7-1.5-1.5s.7-1.6 1.5-1.6 1.6.7 1.6 1.6-.7 1.5-1.6 1.5zm4.8 0c-.8 0-1.6-.7-1.6-1.5s.8-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.5-1.6 1.5z"/></svg>); }
function XIcon(){ return (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 3H14l-3.2 4.4L6.7 3H2l6.4 8.3L2.4 21h4.9l3.5-4.9 4 4.9H22l-6.9-8.5L18.9 3zM9.5 16.6l-1.2 1.7H6.8l2.2-3.1 1 1.4zm5.3 1.7l-6.5-8.1 1.3-1.8 6.5 8.2-1.3 1.7z"/></svg>); }
function TelegramIcon(){ return (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.1a1.3 1.3 0 00-1.3-.1L3.1 11.8c-1 .5-.9 2 .2 2.3l4.6 1.4 1.7 3.6c.4.9 1.7 1 2.3.2l2.6-3.1 4.7 3.8c.8.7 1.9.2 2.1-.8l2.5-13a1.3 1.3 0 00-.9-1.5zm-4.8 3.4l-8.8 7 1.1 2.3 1-1.7 6.7-7.6z"/></svg>); }
function YouTubeIcon(){ return (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.5a3 3 0 00-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 001 .6v12.8a3 3 0 002.1 2.1C4.9 16 12 16 12 16s7 0 8.9-.4A3 3 0 0023 13.5V7.5zM10 13V8l5 2.5L10 13z"/></svg>); }

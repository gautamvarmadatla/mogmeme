import React from "react";

type SocialLink = { href: string; label: string; icon: React.ReactNode };

export default function Footer() {
  const socials: SocialLink[] = [
    { href: "https://motherofgod.fun/", label: "Website", icon: <GlobeIcon /> },
    { href: "https://discord.com", label: "Discord", icon: <DiscordIcon /> },
    { href: "https://x.com/motherofGodSol", label: "X", icon: <XIcon /> },
    { href: "https://t.me/+z88-ob8hT-FjMzgx", label: "Telegram", icon: <TelegramIcon /> },
  ];

  return (
    <footer className="bg-neutral-950 text-neutral-200 border-t border-neutral-800 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center text-xs font-bold tracking-[0.35em] text-neutral-300 mb-3">
          MOGGED BY
        </div>

        {/* CENTERED ROW: bars next to each other with a tiny gap */}
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-center">
          {/* MoG tag bar (no extra space inside, fixed height) */}
          <div className="inline-flex h-12 items-center rounded border border-neutral-700 bg-neutral-900/60">
            <div className="h-12 w-12 shrink-0 rounded-l overflow-hidden bg-gradient-to-br from-red-600 to-blue-600">
              <img src="/mog-logo.jpg" alt="Avatar" className="h-full w-full object-cover" />
            </div>
            <div className="px-3">
              <div className="font-semibold text-sm md:text-base tracking-wide whitespace-nowrap">
                [MOG]Mother of God
              </div>
            </div>
          </div>

          {/* Social bar (same height, compact buttons) */}
          <div className="inline-flex h-12 items-center rounded border border-neutral-700 bg-neutral-900/60 px-2">
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex items-center justify-center h-9 w-9 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition"
                  title={s.label}
                >
                  <div className="h-5 w-5">{s.icon}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] md:text-[11px] leading-relaxed tracking-[0.15em] text-neutral-400 uppercase">
          $MOG IS A CRYPTO ASSET WITH NO INTRINSIC VALUE OR EXPECTATION OF FINANCIAL RETURN. MOG COINS ARE TO BE USED
          FOR ENTERTAINMENT PURPOSES ONLY. THIS WEBSITE IS ENTIRELY FAN MADE AND IS ONLY TO BE USED FOR MEME GENERATION.
        </p>
      </div>
    </footer>
  );
}

/* ---------- Icons (no external deps) ---------- */

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm7.5 9h-3.1a14.7 14.7 0 00-1.2-5A8.02 8.02 0 0119.5 11zM12 4a12.9 12.9 0 011.9 6H10.1A12.9 12.9 0 0112 4zM4.5 11h3.1a14.7 14.7 0 011.2-5A8.02 8.02 0 004.5 11zM8.8 13H4.5a8.02 8.02 0 004.3 5 14.7 14.7 0 01-1.2-5zm3.2 7a12.9 12.9 0 01-1.9-6h3.8a12.9 12.9 0 01-1.9 6zm3.7-2a8.02 8.02 0 004.3-5h-3.1a14.7 14.7 0 01-1.2 5z" />
    </svg>
  );
}
function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.7 5.3A16.3 16.3 0 0015.6 4l-.2.4a11 11 0 00-6.8 0L8.4 4A16.3 16.3 0 004.3 5.3 15 15 0 002 14.9c2.3 2 4.7 2.8 7 3l.7-1.5c-.4-.1-.9-.3-1.5-.6.1-.1.2-.1.3-.2a6.7 6.7 0 005.2 0l.3.2c-.6.3-1.1.5-1.5.6l.7 1.5c2.3-.3 4.7-1.1 7-3a15 15 0 00-2.3-9.6zM9.6 13.3c-.8 0-1.5-.7-1.5-1.5s.7-1.6 1.5-1.6 1.6.7 1.6 1.6-.7 1.5-1.6 1.5zm4.8 0c-.8 0-1.6-.7-1.6-1.5s.8-1.6 1.6-1.6 1.6.7 1.6 1.6-.7 1.5-1.6 1.5z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 3H14l-3.2 4.4L6.7 3H2l6.4 8.3L2.4 21h4.9l3.5-4.9 4 4.9H22l-6.9-8.5L18.9 3zM9.5 16.6l-1.2 1.7H6.8l2.2-3.1 1 1.4zm5.3 1.7l-6.5-8.1 1.3-1.8 6.5 8.2-1.3 1.7z" />
    </svg>
  );
}
function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.9 4.1a1.3 1.3 0 00-1.3-.1L3.1 11.8c-1 .5-.9 2 .2 2.3l4.6 1.4 1.7 3.6c.4.9 1.7 1 2.3.2l2.6-3.1 4.7 3.8c.8.7 1.9.2 2.1-.8l2.5-13a1.3 1.3 0 00-.9-1.5zm-4.8 3.4l-8.8 7 1.1 2.3 1-1.7 6.7-7.6z" />
    </svg>
  );
}

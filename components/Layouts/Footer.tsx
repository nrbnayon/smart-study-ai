"use client";
import Image from "next/image";
import Link from "next/link";
import { Send, Twitter, Facebook, Instagram, Youtube } from "lucide-react";
import { footerLinks } from "@/data/landingData";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon } from "@hugeicons/core-free-icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="footer" className="bg-foreground py-12 text-white">
      <div className="container-1620">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Link href="/">
              <Image
                src="/icons/logo.png"
                alt="BassPort"
                width={140}
                height={40}
                className="h-auto w-[140px]"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Your premium bass fishing intelligence platform. Discover the
              right lake, right conditions, and right timing.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/85">
              <HugeiconsIcon
                icon={Mail02Icon}
                className="h-4 w-4 text-primary"
              />{" "}
              william@bassport.pro
            </p>
          </div>

          <div>
            <h4 className="text-base font-semibold">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {footerLinks.quick.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold">Top Lakes</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {footerLinks.lakes.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold">Weekly Reports</h4>
            <p className="mt-4 text-sm text-white/70">
              Get latest reports delivered to your inbox every week.
            </p>
            <div className="mt-4 flex rounded-lg border border-white/20 bg-white/10 p-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/55 outline-none"
              />
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 cursor-pointer">
                <Send className="h-3.5 w-3.5" /> Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row">
          <p>
            {year} BASSPORT. All rights reserved. Built for bass anglers, by
            bass anglers.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-white transition">
              Cookie Policy
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-primary transition">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-primary transition">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-primary transition">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" className="hover:text-primary transition">
              <Youtube className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

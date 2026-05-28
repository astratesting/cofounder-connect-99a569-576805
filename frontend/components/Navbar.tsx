import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-950">
          <span className="rounded-2xl bg-brand p-2 text-white"><Sparkles size={18} /></span>
          CoFounder Connect
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link href="/#how" className="hidden text-slate-600 hover:text-slate-950 sm:block">How it works</Link>
          <SignedIn>
            <Link href="/dashboard" className="rounded-full bg-slate-950 px-4 py-2 text-white hover:bg-slate-800">Dashboard</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in" className="text-slate-700 hover:text-slate-950">Log in</Link>
            <Link href="/sign-up" className="rounded-full bg-brand px-4 py-2 text-white shadow-glow hover:bg-violet-700">Join beta</Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
}

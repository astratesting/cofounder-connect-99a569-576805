import Link from 'next/link';
import { ArrowRight, CheckCircle2, FileText, Link2, MessageSquare, Radar, ShieldCheck, Sparkles, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

const features = [
  { icon: Radar, title: 'Real-time matching', body: 'Skills, interests, and founder goals produce compatibility scores instantly.' },
  { icon: Link2, title: 'Live URL sharing', body: 'LinkedIn, GitHub, and portfolio links sit beside every profile for fast diligence.' },
  { icon: FileText, title: 'Pitch deck previews', body: 'Upload a deck, preview it in profile, and let serious matches review traction.' },
  { icon: MessageSquare, title: 'Matched messaging', body: 'Chat opens only after mutual fit so every conversation starts with context.' }
];

const founders = [
  { name: 'Maya Chen', role: 'Product founder', score: 94, skills: ['Growth', 'B2B SaaS', 'Fundraising'] },
  { name: 'Noah Patel', role: 'AI engineer', score: 91, skills: ['ML infra', 'Python', 'Realtime'] },
  { name: 'Amara Okafor', role: 'Design operator', score: 88, skills: ['UX', 'Community', 'No-code'] }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="relative overflow-hidden bg-midnight text-white">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_20%,#7C3AED,transparent_35%),radial-gradient(circle_at_80%_0%,#2DD4BF,transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-violet-100">
              <Sparkles size={16} /> Founder matching built for demo day speed
            </div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Meet a serious co-founder before momentum fades.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              CoFounder Connect pairs founders by skills, interests, live proof links, and pitch decks so teams can form faster than forum threads and cold DMs.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sign-up" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-slate-100">
                Create founder profile <ArrowRight size={18} />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10">
                View demo dashboard
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-2"><ShieldCheck size={16} /> Auth ready</span>
              <span className="flex items-center gap-2"><Users size={16} /> Match scoring</span>
              <span className="flex items-center gap-2"><MessageSquare size={16} /> Live chat UI</span>
            </div>
          </div>
          <div className="gradient-card rounded-[2rem] p-4 text-slate-950 shadow-2xl">
            <div className="rounded-[1.5rem] bg-white p-5 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand">Discover queue</p>
                  <h2 className="text-2xl font-bold">Top compatible founders</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">Live</span>
              </div>
              <div className="space-y-4">
                {founders.map((founder) => (
                  <div key={founder.name} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold">{founder.name}</h3>
                        <p className="text-sm text-slate-600">{founder.role}</p>
                      </div>
                      <div className="rounded-2xl bg-violet-100 px-3 py-2 text-center text-brand">
                        <p className="text-xs font-semibold">Score</p>
                        <p className="text-xl font-black">{founder.score}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {founder.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{skill}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="how" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold text-brand">Lean MVP, real workflow</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">From profile to partner conversation in minutes.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <feature.icon className="mb-5 text-brand" size={28} />
              <h3 className="text-lg font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {['Create verified profile', 'Swipe with scoring', 'Chat with mutual matches'].map((step, index) => (
            <div key={step} className="flex gap-4 rounded-3xl bg-slate-50 p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 font-bold text-white">{index + 1}</span>
              <div>
                <h3 className="font-bold">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600"><CheckCircle2 className="mr-1 inline text-mint" size={16} />Built for first-user demo flows and investor-ready founder discovery.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

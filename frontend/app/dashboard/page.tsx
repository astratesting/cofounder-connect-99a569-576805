'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FileText, Github, Heart, Linkedin, MessageSquare, Send, Upload, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import clsx from 'clsx';

type Founder = {
  id: string;
  name: string;
  role: string;
  bio: string;
  skills: string[];
  interests: string[];
  liveUrl: string;
  github: string;
  deck: string;
  compatibilityScore: number;
};

type ChatMessage = {
  id: string;
  sender: 'me' | 'them';
  content: string;
  createdAt: string;
};

const discover: Founder[] = [
  {
    id: 'maya',
    name: 'Maya Chen',
    role: 'Product founder building sales automation',
    bio: 'Ex-growth lead with $1.2M ARR B2B SaaS experience. Looking for a technical co-founder who can ship AI workflow infrastructure.',
    skills: ['Growth', 'B2B SaaS', 'Fundraising'],
    interests: ['AI agents', 'Sales ops', 'PLG'],
    liveUrl: 'https://linkedin.com/in/mayachen',
    github: 'https://github.com/maya-builds',
    deck: 'maya-seed-deck.pdf',
    compatibilityScore: 94
  },
  {
    id: 'noah',
    name: 'Noah Patel',
    role: 'AI infra engineer exploring devtools',
    bio: 'Built low-latency ML systems and wants a GTM partner to commercialize realtime coding automation for startup teams.',
    skills: ['Python', 'Realtime', 'ML infra'],
    interests: ['Developer tools', 'Agents', 'Enterprise'],
    liveUrl: 'https://noahpatel.dev',
    github: 'https://github.com/noahml',
    deck: 'devtools-thesis.pdf',
    compatibilityScore: 91
  },
  {
    id: 'amara',
    name: 'Amara Okafor',
    role: 'Design operator validating creator fintech',
    bio: 'Community-led founder with design systems background. Seeking technical partner for trusted payments and revenue analytics.',
    skills: ['UX', 'Community', 'No-code'],
    interests: ['Fintech', 'Creator economy', 'Trust'],
    liveUrl: 'https://amara.design',
    github: 'https://github.com/amaraops',
    deck: 'creator-finance.pdf',
    compatibilityScore: 88
  }
];

const initialMessages: ChatMessage[] = [
  { id: '1', sender: 'them', content: 'Your GTM experience lines up with my AI workflow prototype. Want to compare founder-market fit notes?', createdAt: '9:42 AM' },
  { id: '2', sender: 'me', content: 'Yes. Your pitch deck traction slide is exactly what I wanted to understand first.', createdAt: '9:45 AM' }
];

export default function DashboardPage() {
  const { user } = useUser();
  const [activeIndex, setActiveIndex] = useState(0);
  const [matches, setMatches] = useState<Founder[]>([discover[0]]);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [profile, setProfile] = useState({
    name: user?.fullName ?? 'Demo Founder',
    bio: 'Second-time founder looking for a technical partner to build real-time collaboration tools.',
    skills: 'Product, GTM, Fundraising',
    interests: 'AI agents, Collaboration, B2B SaaS',
    liveUrl: 'https://linkedin.com/in/demo-founder',
    pitchDeckUrl: 'https://example.com/demo-deck.pdf'
  });

  const activeFounder = discover[activeIndex % discover.length];
  const matchedIds = useMemo(() => new Set(matches.map((match) => match.id)), [matches]);

  function swipe(liked: boolean) {
    if (liked && !matchedIds.has(activeFounder.id)) {
      setMatches((current) => [activeFounder, ...current]);
    }
    setActiveIndex((index) => index + 1);
  }

  function sendMessage() {
    const content = draft.trim();
    if (!content) return;
    setMessages((current) => [...current, { id: crypto.randomUUID(), sender: 'me', content, createdAt: 'Now' }]);
    setDraft('');
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="font-semibold text-brand">Founder command center</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Build profile, discover matches, start chat.</h1>
        </div>
        <div className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm">
          {matches.length} active match{matches.length === 1 ? '' : 'es'} · {discover.length} founders in queue
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.1fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Profile studio</h2>
              <p className="text-sm text-slate-600">Edit public founder profile and proof links.</p>
            </div>
            <Upload className="text-brand" />
          </div>
          <div className="grid gap-4">
            <label className="text-sm font-semibold text-slate-700">Name
              <input className="mt-1 w-full rounded-2xl border-slate-200" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            </label>
            <label className="text-sm font-semibold text-slate-700">Bio
              <textarea className="mt-1 min-h-28 w-full rounded-2xl border-slate-200" value={profile.bio} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Skills
                <input className="mt-1 w-full rounded-2xl border-slate-200" value={profile.skills} onChange={(event) => setProfile({ ...profile, skills: event.target.value })} />
              </label>
              <label className="text-sm font-semibold text-slate-700">Interests
                <input className="mt-1 w-full rounded-2xl border-slate-200" value={profile.interests} onChange={(event) => setProfile({ ...profile, interests: event.target.value })} />
              </label>
            </div>
            <label className="text-sm font-semibold text-slate-700">Live URL
              <input className="mt-1 w-full rounded-2xl border-slate-200" value={profile.liveUrl} onChange={(event) => setProfile({ ...profile, liveUrl: event.target.value })} />
            </label>
            <label className="text-sm font-semibold text-slate-700">Pitch deck PDF URL
              <input className="mt-1 w-full rounded-2xl border-slate-200" value={profile.pitchDeckUrl} onChange={(event) => setProfile({ ...profile, pitchDeckUrl: event.target.value })} />
            </label>
          </div>
          <div className="mt-5 rounded-3xl bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 font-bold"><FileText size={18} /> Pitch deck preview</div>
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
              {profile.pitchDeckUrl ? `Ready to preview: ${profile.pitchDeckUrl}` : 'Add a PDF URL to preview your deck.'}
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Discover</h2>
                <p className="text-sm text-slate-600">Swipe through compatibility-ranked founders.</p>
              </div>
              <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-bold text-brand">{activeFounder.compatibilityScore}% match</span>
            </div>
            <motion.div key={activeFounder.id + activeIndex} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="gradient-card rounded-[2rem] border border-slate-200 p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-3xl font-black">{activeFounder.name}</h3>
                  <p className="mt-1 font-semibold text-slate-700">{activeFounder.role}</p>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-600">{activeFounder.bio}</p>
                </div>
                <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Compatibility</p>
                  <p className="text-4xl font-black text-brand">{activeFounder.compatibilityScore}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {[...activeFounder.skills, ...activeFounder.interests].map((item) => <span key={item} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm">{item}</span>)}
              </div>
              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
                <a href={activeFounder.liveUrl} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-white"><Linkedin size={16} /> Live URL</a>
                <a href={activeFounder.github} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm"><Github size={16} /> GitHub</a>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-slate-800 shadow-sm"><FileText size={16} /> {activeFounder.deck}</span>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button onClick={() => swipe(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"><X size={18} /> Pass</button>
                <button onClick={() => swipe(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 font-bold text-white hover:bg-violet-700"><Heart size={18} /> Match</button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Matches</h2>
          <div className="mt-5 space-y-3">
            {matches.map((match) => (
              <div key={match.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold">{match.name}</h3>
                    <p className="text-sm text-slate-600">{match.role}</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">{match.compatibilityScore}%</span>
                </div>
                <a href={match.liveUrl} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand"><ExternalLink size={14} /> View live profile</a>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <MessageSquare className="text-brand" />
            <div>
              <h2 className="text-2xl font-bold">Chat</h2>
              <p className="text-sm text-slate-600">Messaging opens for accepted matches.</p>
            </div>
          </div>
          <div className="h-80 space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
            {messages.map((message) => (
              <div key={message.id} className={clsx('max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm', message.sender === 'me' ? 'ml-auto bg-brand text-white' : 'bg-white text-slate-700')}>
                <p>{message.content}</p>
                <p className={clsx('mt-1 text-xs', message.sender === 'me' ? 'text-violet-100' : 'text-slate-400')}>{message.createdAt}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-3">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} className="flex-1 rounded-2xl border-slate-200" placeholder="Send a thoughtful founder intro..." />
            <button onClick={sendMessage} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white hover:bg-slate-800"><Send size={18} /> Send</button>
          </div>
        </section>
      </div>
    </main>
  );
}

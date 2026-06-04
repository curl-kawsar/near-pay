"use client";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import {
  ArrowRight,
  Radio,
  ShieldCheck,
  Store,
  Wifi,
  Waves,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Wifi,
    title: "Room link",
    desc: "A six-digit session code pairs merchant and customer instantly over your network.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Waves,
    title: "Sound wave",
    desc: "Send payment data through near-silent audio when devices are side by side.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: ShieldCheck,
    title: "Clear checkout",
    desc: "Customers see amount and details the moment the transfer completes.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const steps = [
  "Merchant opens the terminal and shares the session code.",
  "Customer joins with the same code and waits for payment.",
  "Merchant sends — the customer screen updates in real time.",
];

export default function HomePage() {
  return (
    <div className="relative">
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-14 md:px-6 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-sm font-medium text-teal-800">
              <Radio className="h-4 w-4" />
              Proximity payments
            </p>
            <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 md:text-6xl">
              Pay when you&apos;re
              <span className="block text-teal-600">close enough</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              NearPay moves transaction details between merchant and customer
              — over a private room link or through sound. Simple, fast, nearby.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/merchant">
                <Button size="lg" className="w-full sm:w-auto">
                  <Store className="h-5 w-5" />
                  Merchant terminal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/customer">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Zap className="h-5 w-5" />
                  Customer receive
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-4 rounded-3xl bg-teal-100/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
              <Image
                src="/static/undraw_Credit_card_re_blml.png"
                alt="Contactless payment"
                width={480}
                height={360}
                className="mx-auto w-full max-w-md object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/80 py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900 md:text-3xl">
            Two ways to pay nearby
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Pick the channel that fits your setup — room link for reliability,
            sound wave for a seamless proximity feel.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <GlassCard key={f.title}>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${f.color}`}
                >
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <GlassCard className="flex flex-col items-center gap-8 md:flex-row md:text-left">
          <Image
            src="/static/undraw_Mobile_payments_re_7udl.png"
            alt="Mobile checkout"
            width={220}
            height={180}
            className="shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900">
              Start in three steps
            </h3>
            <ol className="mt-4 space-y-3">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/merchant">
                <Button>Open merchant</Button>
              </Link>
              <Link href="/customer">
                <Button variant="outline">Open customer</Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}

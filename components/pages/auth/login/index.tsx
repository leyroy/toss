import { LifeBuoyIcon, CheckCircleIcon, SparklesIcon } from "lucide-react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Brand & Showcase Side (hidden on mobile) */}
      <div className="relative hidden flex-col justify-between bg-zinc-950 p-10 text-white lg:flex">
        {/* Glow Effects */}
        <div className="absolute inset-0 bg-radial-gradient from-emerald-500/20 via-transparent to-transparent opacity-50" />
        <div className="absolute top-1/4 right-1/4 size-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 size-96 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500 text-black">
            <LifeBuoyIcon className="size-4.5 stroke-[2.5]" />
          </div>
          HelpBridge
        </div>

        {/* Feature List */}
        <div className="relative z-10 my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <SparklesIcon className="size-3.5" />
            Modern Helpdesk System
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Connecting students with dedicated support.
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed">
            Submit tickets, track live progress, and message staff directly from a unified dashboard.
          </p>

          <div className="space-y-3.5 pt-4">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="size-5 text-emerald-400" />
              <span className="text-sm font-medium text-zinc-300">Live split-pane ticket queue & chats</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="size-5 text-emerald-400" />
              <span className="text-sm font-medium text-zinc-300">Responsive panels & drawers</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="size-5 text-emerald-400" />
              <span className="text-sm font-medium text-zinc-300">Fast assignment & role-based dashboard</span>
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} HelpBridge. Developed with premium design.
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex flex-col items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 md:p-10">
        <div className="w-full max-w-sm flex flex-col gap-6">
          {/* Logo visible on mobile only */}
          <div className="flex flex-col gap-2 items-center text-center lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-black shadow-lg shadow-emerald-500/20">
              <LifeBuoyIcon className="size-5.5 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-1">HelpBridge</h2>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

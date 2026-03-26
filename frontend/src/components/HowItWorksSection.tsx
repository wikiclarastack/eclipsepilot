import { LogIn, MessageSquare, Copy, Rocket } from "lucide-react";

const steps = [
  { icon: LogIn, step: "01", title: "Sign in with Discord", desc: "Authenticate securely with your Discord account in one click." },
  { icon: MessageSquare, step: "02", title: "Ask the AI", desc: "Describe your problem or request a script in plain English." },
  { icon: Copy, step: "03", title: "Get Expert Code", desc: "Receive production-ready Luau code with explanations." },
  { icon: Rocket, step: "04", title: "Ship Your Game", desc: "Implement the solution and launch your Roblox game faster." },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-900/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Get from idea to working code in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, step, title, desc }, i) => (
            <div key={step} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-600/40 to-transparent z-10" />
              )}
              <div className="card text-center">
                <div className="text-xs font-mono text-brand-400 mb-3">{step}</div>
                <div className="w-12 h-12 bg-brand-600/20 border border-brand-600/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

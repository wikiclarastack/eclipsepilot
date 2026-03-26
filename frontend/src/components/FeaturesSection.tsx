import {
  Code2, Database, Wifi, Shield, Zap, Layers,
  Bug, Package, DollarSign, Gamepad2, Cpu, Lock,
} from "lucide-react";

const features = [
  { icon: Code2, title: "Luau Scripting", desc: "Advanced Luau patterns, OOP, metatables, and best practices." },
  { icon: Wifi, title: "RemoteEvents & Functions", desc: "Secure client-server communication architecture." },
  { icon: Database, title: "DataStore Systems", desc: "Persistent data with retry logic, caching, and error handling." },
  { icon: Shield, title: "Anti-Cheat", desc: "Server-side validation, exploit detection, and security layers." },
  { icon: Gamepad2, title: "Multiplayer Systems", desc: "Replication, lag compensation, and sync strategies." },
  { icon: DollarSign, title: "Game Economy", desc: "Currency systems, shops, trading, and monetization." },
  { icon: Layers, title: "UI/UX in Roblox", desc: "Professional GUIs, animations, and responsive layouts." },
  { icon: Zap, title: "Performance Optimization", desc: "Memory management, LOD, and rendering optimization." },
  { icon: Bug, title: "Debug & Analysis", desc: "Paste your script and get instant error detection." },
  { icon: Package, title: "Script Library", desc: "50+ production-ready scripts and modules." },
  { icon: Cpu, title: "Systems Architecture", desc: "Scalable game architecture and design patterns." },
  { icon: Lock, title: "Security", desc: "Exploit prevention, input validation, and secure APIs." },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything a Roblox Developer Needs
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From beginner scripting to enterprise-level game architecture — our AI covers every aspect of Roblox development.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card glass-hover group"
            >
              <div className="w-10 h-10 bg-brand-600/20 border border-brand-600/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-600/30 transition-colors">
                <Icon className="w-5 h-5 text-brand-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

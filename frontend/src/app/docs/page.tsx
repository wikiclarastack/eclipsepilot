"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { BookOpen, Search, ChevronRight } from "lucide-react";

const docs: Record<string, { title: string; content: string }[]> = {
  Luau: [
    {
      title: "Type System & Annotations",
      content: `Luau supports gradual typing. Use type annotations for better tooling and safety.\n\n\`\`\`luau\ntype Player = {\n  Name: string,\n  UserId: number,\n  Level: number,\n}\n\nlocal function greet(player: Player): string\n  return "Hello, " .. player.Name\nend\n\`\`\``,
    },
    {
      title: "Metatables & OOP",
      content: `Create classes using metatables for clean object-oriented code.\n\n\`\`\`luau\nlocal Enemy = {}\nEnemy.__index = Enemy\n\nfunction Enemy.new(name: string, health: number)\n  return setmetatable({ Name = name, Health = health }, Enemy)\nend\n\nfunction Enemy:TakeDamage(amount: number)\n  self.Health = math.max(0, self.Health - amount)\nend\n\`\`\``,
    },
    {
      title: "Coroutines & Async Patterns",
      content: `Use coroutines and task library for async operations.\n\n\`\`\`luau\n-- Preferred: task library\ntask.spawn(function()\n  task.wait(1)\n  print("After 1 second")\nend)\n\n-- Promise-like pattern\nlocal function fetchData(userId: number)\n  return Promise.new(function(resolve, reject)\n    local success, data = pcall(function()\n      return DataStore:GetAsync(userId)\n    end)\n    if success then resolve(data) else reject(data) end\n  end)\nend\n\`\`\``,
    },
  ],
  DataStore: [
    {
      title: "Safe DataStore with Retry",
      content: `Always wrap DataStore calls in pcall with retry logic.\n\n\`\`\`luau\nlocal DataStoreService = game:GetService("DataStoreService")\nlocal PlayerData = DataStoreService:GetDataStore("PlayerData")\n\nlocal function safeGet(key: string, retries: number?)\n  retries = retries or 3\n  for i = 1, retries do\n    local ok, result = pcall(function()\n      return PlayerData:GetAsync(key)\n    end)\n    if ok then return result end\n    task.wait(2 ^ i) -- exponential backoff\n  end\n  return nil\nend\n\`\`\``,
    },
    {
      title: "Session Locking",
      content: `Prevent data corruption with session locking.\n\n\`\`\`luau\nlocal sessions = {}\n\nlocal function lockSession(userId: number): boolean\n  if sessions[userId] then return false end\n  sessions[userId] = true\n  return true\nend\n\nlocal function unlockSession(userId: number)\n  sessions[userId] = nil\nend\n\`\`\``,
    },
  ],
  Remotes: [
    {
      title: "Secure RemoteEvent Pattern",
      content: `Always validate on the server. Never trust the client.\n\n\`\`\`luau\n-- Server\nlocal BuyItem = game.ReplicatedStorage.Remotes.BuyItem\n\nBuyItem.OnServerEvent:Connect(function(player, itemId)\n  -- Validate types\n  if type(itemId) ~= "string" then return end\n  -- Validate item exists\n  if not ItemCatalog[itemId] then return end\n  -- Validate player can afford\n  local price = ItemCatalog[itemId].Price\n  if PlayerData[player.UserId].Coins < price then return end\n  -- Process purchase\n  processPurchase(player, itemId)\nend)\n\`\`\``,
    },
    {
      title: "RemoteFunction with Timeout",
      content: `Add timeouts to RemoteFunctions to prevent exploiter hangs.\n\n\`\`\`luau\nlocal function invokeWithTimeout(remote, player, timeout, ...)\n  local result = nil\n  local done = false\n  task.spawn(function()\n    result = remote:InvokeClient(player, ...)\n    done = true\n  end)\n  local elapsed = 0\n  while not done and elapsed < timeout do\n    task.wait(0.1)\n    elapsed += 0.1\n  end\n  return result\nend\n\`\`\``,
    },
  ],
  Security: [
    {
      title: "Server-Side Validation",
      content: `Every action must be validated server-side.\n\n\`\`\`luau\nlocal function validateAction(player: Player, action: string, data: any): boolean\n  -- Rate limiting\n  local now = os.clock()\n  local lastAction = playerCooldowns[player.UserId] or 0\n  if now - lastAction < 0.1 then -- 100ms cooldown\n    warn("Rate limit hit:", player.Name)\n    return false\n  end\n  playerCooldowns[player.UserId] = now\n  \n  -- Sanity checks\n  if type(action) ~= "string" then return false end\n  if #action > 50 then return false end\n  \n  return true\nend\n\`\`\``,
    },
  ],
  UI: [
    {
      title: "Responsive GUI with UIAspectRatioConstraint",
      content: `Make GUIs work on all screen sizes.\n\n\`\`\`luau\nlocal function createResponsiveFrame(parent)\n  local frame = Instance.new("Frame")\n  frame.Size = UDim2.fromScale(0.4, 0.6)\n  frame.AnchorPoint = Vector2.new(0.5, 0.5)\n  frame.Position = UDim2.fromScale(0.5, 0.5)\n  frame.Parent = parent\n  \n  local ratio = Instance.new("UIAspectRatioConstraint")\n  ratio.AspectRatio = 16/9\n  ratio.Parent = frame\n  \n  return frame\nend\n\`\`\``,
    },
  ],
  Monetization: [
    {
      title: "MarketplaceService Integration",
      content: `Handle Robux purchases safely.\n\n\`\`\`luau\nlocal MarketplaceService = game:GetService("MarketplaceService")\nlocal PRODUCT_IDS = { Coins100 = 123456789 }\n\nMarketplaceService.ProcessReceipt = function(info)\n  local player = game.Players:GetPlayerByUserId(info.PlayerId)\n  if not player then\n    return Enum.ProductPurchaseDecision.NotProcessedYet\n  end\n  \n  if info.ProductId == PRODUCT_IDS.Coins100 then\n    -- Award coins\n    local ok = pcall(awardCoins, player, 100)\n    if ok then\n      return Enum.ProductPurchaseDecision.PurchaseGranted\n    end\n  end\n  \n  return Enum.ProductPurchaseDecision.NotProcessedYet\nend\n\`\`\``,
    },
  ],
};

const categories = Object.keys(docs);

export default function DocsPage() {
  const [activeCategory, setActiveCategory] = useState("Luau");
  const [activeDoc, setActiveDoc] = useState(0);
  const [search, setSearch] = useState("");

  const filtered = docs[activeCategory].filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        {/* Doc sidebar */}
        <div className="w-56 glass border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-semibold text-white">Documentation</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-2">
            {categories.map((cat) => (
              <div key={cat}>
                <button
                  onClick={() => { setActiveCategory(cat); setActiveDoc(0); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? "text-brand-400 bg-brand-600/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
                {activeCategory === cat && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    {filtered.map((doc, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveDoc(i)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 ${
                          activeDoc === i
                            ? "text-white bg-white/10"
                            : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <ChevronRight className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{doc.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Doc content */}
        <div className="flex-1 overflow-y-auto p-8">
          {filtered[activeDoc] ? (
            <div className="max-w-3xl animate-fade-in">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                <span>{activeCategory}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-300">{filtered[activeDoc].title}</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-6">{filtered[activeDoc].title}</h1>
              <div className="prose-dark">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 leading-relaxed">
                  {filtered[activeDoc].content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              No results found.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

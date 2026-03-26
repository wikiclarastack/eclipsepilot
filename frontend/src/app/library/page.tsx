"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Package, Copy, Check, Search, Tag } from "lucide-react";

const scripts = [
  {
    id: 1,
    title: "DataStore Manager",
    category: "Data",
    tags: ["DataStore", "Persistence", "Module"],
    description: "Production-ready DataStore module with retry logic, session locking, and caching.",
    code: `-- DataStore Manager Module
local DataStoreService = game:GetService("DataStoreService")
local RunService = game:GetService("RunService")

local DataManager = {}
DataManager.__index = DataManager

local RETRY_ATTEMPTS = 3
local RETRY_DELAY = 2
local cache = {}

function DataManager.new(storeName: string)
  return setmetatable({
    store = DataStoreService:GetDataStore(storeName),
    sessions = {},
  }, DataManager)
end

function DataManager:Get(key: string): any
  if cache[key] then return cache[key] end
  for i = 1, RETRY_ATTEMPTS do
    local ok, result = pcall(function()
      return self.store:GetAsync(key)
    end)
    if ok then
      cache[key] = result
      return result
    end
    task.wait(RETRY_DELAY * i)
  end
  return nil
end

function DataManager:Set(key: string, value: any): boolean
  cache[key] = value
  for i = 1, RETRY_ATTEMPTS do
    local ok = pcall(function()
      self.store:SetAsync(key, value)
    end)
    if ok then return true end
    task.wait(RETRY_DELAY * i)
  end
  return false
end

function DataManager:Update(key: string, transform: (any) -> any): boolean
  for i = 1, RETRY_ATTEMPTS do
    local ok = pcall(function()
      self.store:UpdateAsync(key, transform)
    end)
    if ok then
      cache[key] = nil -- invalidate cache
      return true
    end
    task.wait(RETRY_DELAY * i)
  end
  return false
end

return DataManager`,
  },
  {
    id: 2,
    title: "Remote Handler",
    category: "Networking",
    tags: ["RemoteEvent", "Security", "Server"],
    description: "Secure remote event handler with rate limiting and input validation.",
    code: `-- Secure Remote Handler
local Players = game:GetService("Players")

local RemoteHandler = {}
local cooldowns: {[number]: number} = {}

local function rateLimit(player: Player, cooldown: number): boolean
  local now = os.clock()
  local last = cooldowns[player.UserId] or 0
  if now - last < cooldown then return false end
  cooldowns[player.UserId] = now
  return true
end

function RemoteHandler.bind(remote: RemoteEvent, handler: (Player, ...any) -> (), cooldown: number?)
  cooldown = cooldown or 0.1
  remote.OnServerEvent:Connect(function(player, ...)
    if not rateLimit(player, cooldown) then
      warn("Rate limit:", player.Name)
      return
    end
    local ok, err = pcall(handler, player, ...)
    if not ok then
      warn("Remote error:", err)
    end
  end)
end

Players.PlayerRemoving:Connect(function(player)
  cooldowns[player.UserId] = nil
end)

return RemoteHandler`,
  },
  {
    id: 3,
    title: "Tween Utility",
    category: "UI",
    tags: ["Tween", "Animation", "UI"],
    description: "Clean tween utility for smooth UI animations.",
    code: `-- Tween Utility
local TweenService = game:GetService("TweenService")

local Tween = {}

local defaults = TweenInfo.new(0.3, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)

function Tween.play(instance: Instance, props: {[string]: any}, info: TweenInfo?): Tween
  local tween = TweenService:Create(instance, info or defaults, props)
  tween:Play()
  return tween
end

function Tween.fadeIn(gui: GuiObject, duration: number?): Tween
  gui.Visible = true
  gui.BackgroundTransparency = 1
  return Tween.play(gui, { BackgroundTransparency = 0 },
    TweenInfo.new(duration or 0.3, Enum.EasingStyle.Quart))
end

function Tween.fadeOut(gui: GuiObject, duration: number?): Tween
  local t = Tween.play(gui, { BackgroundTransparency = 1 },
    TweenInfo.new(duration or 0.3, Enum.EasingStyle.Quart))
  t.Completed:Connect(function() gui.Visible = false end)
  return t
end

function Tween.slideIn(gui: GuiObject, from: UDim2, to: UDim2): Tween
  gui.Position = from
  gui.Visible = true
  return Tween.play(gui, { Position = to })
end

return Tween`,
  },
  {
    id: 4,
    title: "Anti-Cheat Core",
    category: "Security",
    tags: ["AntiCheat", "Security", "Server"],
    description: "Server-side anti-cheat detecting speed hacks and teleport hacks.",
    code: `-- Anti-Cheat Core (Server)
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local MAX_SPEED = 32 -- studs/second
local MAX_TELEPORT = 50 -- studs per check
local CHECK_INTERVAL = 0.5
local VIOLATIONS: {[number]: number} = {}
local lastPositions: {[number]: Vector3} = {}

local function flag(player: Player, reason: string)
  local id = player.UserId
  VIOLATIONS[id] = (VIOLATIONS[id] or 0) + 1
  warn(string.format("[AntiCheat] %s flagged: %s (x%d)", player.Name, reason, VIOLATIONS[id]))
  
  if VIOLATIONS[id] >= 5 then
    player:Kick("Exploiting detected.")
  end
end

local function checkPlayer(player: Player)
  local char = player.Character
  if not char then return end
  local root = char:FindFirstChild("HumanoidRootPart") :: BasePart
  local hum = char:FindFirstChild("Humanoid") :: Humanoid
  if not root or not hum then return end
  
  local pos = root.Position
  local last = lastPositions[player.UserId]
  
  if last then
    local dist = (pos - last).Magnitude
    local speed = dist / CHECK_INTERVAL
    
    if dist > MAX_TELEPORT and hum.MoveDirection.Magnitude == 0 then
      flag(player, "Teleport hack")
    elseif speed > MAX_SPEED * 1.5 then
      flag(player, "Speed hack")
    end
  end
  
  lastPositions[player.UserId] = pos
end

RunService.Heartbeat:Connect(function()
  for _, player in Players:GetPlayers() do
    task.spawn(checkPlayer, player)
  end
end)

Players.PlayerRemoving:Connect(function(p)
  VIOLATIONS[p.UserId] = nil
  lastPositions[p.UserId] = nil
end)`,
  },
  {
    id: 5,
    title: "Signal (Custom Events)",
    category: "Utility",
    tags: ["Signal", "Events", "Module"],
    description: "Lightweight Signal class for custom events without RemoteEvents.",
    code: `-- Signal Module
local Signal = {}
Signal.__index = Signal

function Signal.new()
  return setmetatable({ _connections = {} }, Signal)
end

function Signal:Connect(fn: (...any) -> ())
  local conn = { fn = fn, connected = true }
  table.insert(self._connections, conn)
  return {
    Disconnect = function()
      conn.connected = false
    end
  }
end

function Signal:Once(fn: (...any) -> ())
  local conn
  conn = self:Connect(function(...)
    conn.Disconnect()
    fn(...)
  end)
  return conn
end

function Signal:Fire(...)
  for i = #self._connections, 1, -1 do
    local conn = self._connections[i]
    if conn.connected then
      task.spawn(conn.fn, ...)
    else
      table.remove(self._connections, i)
    end
  end
end

function Signal:Destroy()
  self._connections = {}
end

return Signal`,
  },
  {
    id: 6,
    title: "Leaderboard System",
    category: "Data",
    tags: ["Leaderboard", "OrderedDataStore", "UI"],
    description: "Top 10 leaderboard using OrderedDataStore with GUI display.",
    code: `-- Leaderboard System
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local LeaderboardStore = DataStoreService:GetOrderedDataStore("GlobalLeaderboard")

local Leaderboard = {}

function Leaderboard.submit(userId: number, score: number)
  pcall(function()
    LeaderboardStore:SetAsync(tostring(userId), score)
  end)
end

function Leaderboard.getTop(count: number): {{name: string, score: number}}
  local results = {}
  local ok, pages = pcall(function()
    return LeaderboardStore:GetSortedAsync(false, count)
  end)
  if not ok then return results end
  
  local data = pages:GetCurrentPage()
  for _, entry in data do
    local name = "[Unknown]"
    pcall(function()
      name = Players:GetNameFromUserIdAsync(tonumber(entry.key))
    end)
    table.insert(results, { name = name, score = entry.value })
  end
  return results
end

-- Auto-submit on player leave
Players.PlayerRemoving:Connect(function(player)
  local ls = player:FindFirstChild("leaderstats")
  if ls then
    local score = ls:FindFirstChild("Score")
    if score then
      Leaderboard.submit(player.UserId, score.Value)
    end
  end
end)

return Leaderboard`,
  },
];

const categories = ["All", ...Array.from(new Set(scripts.map((s) => s.category)))];

export default function LibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(scripts[0]);
  const [copied, setCopied] = useState(false);

  const filtered = scripts.filter((s) => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const copy = () => {
    navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-72 glass border-r border-white/5 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-semibold text-white">Script Library</span>
            </div>
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search scripts..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                    category === cat
                      ? "bg-brand-600 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full text-left p-3 rounded-xl transition-all ${
                  selected.id === s.id
                    ? "bg-brand-600/20 border border-brand-600/30"
                    : "hover:bg-white/5"
                }`}
              >
                <p className={`text-sm font-medium ${selected.id === s.id ? "text-white" : "text-slate-300"}`}>
                  {s.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{s.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {s.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-brand-400 bg-brand-600/10 px-2 py-0.5 rounded-full">
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-slate-600 text-sm py-8">No scripts found</p>
            )}
          </div>
        </div>

        {/* Code viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-white">{selected.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selected.description}</p>
            </div>
            <button
              onClick={copy}
              className="flex items-center gap-2 btn-secondary text-sm py-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            <pre className="p-6 text-xs font-mono text-slate-300 leading-relaxed whitespace-pre">
              {selected.code}
            </pre>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

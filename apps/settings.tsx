"use client"

import { useMemo, useState } from "react"
import { Monitor, Palette, Bell, Shield, Info, Wifi, Volume2 } from "lucide-react"
import { useSettingsStore } from "@/store/settings-store"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

type CategoryId = "system" | "display" | "sound" | "network" | "privacy" | "about"

interface Category {
  id: CategoryId
  title: string
  description: string
  icon: typeof Monitor
}

const categories: Category[] = [
  { id: "system", title: "System", description: "Core system preferences", icon: Monitor },
  { id: "display", title: "Display", description: "Screen and appearance", icon: Palette },
  { id: "sound", title: "Sound", description: "Audio devices and effects", icon: Volume2 },
  { id: "network", title: "Network", description: "Wi-Fi and connectivity", icon: Wifi },
  { id: "privacy", title: "Privacy", description: "Permissions and privacy", icon: Shield },
  { id: "about", title: "About", description: "Version and environment", icon: Info },
]

function CategorySidebar({
  selected,
  onSelect,
  onBack,
}: {
  selected: CategoryId
  onSelect: (id: CategoryId) => void
  onBack: () => void
}) {
  return (
    <div className="w-64 bg-[#252525] border-r border-[#3d3d3d] p-4">
      <button
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
      >
        <span aria-hidden>←</span>
        Back to Settings
      </button>

      <div className="space-y-1">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isSelected = selected === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-left transition-colors ${
                isSelected ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <Icon className="h-5 w-5 text-white/70" />
              <span className="text-sm text-white/90">{cat.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function CategoryContent({ selected }: { selected: CategoryId }) {
  const { soundsEnabled, animationsEnabled, setSoundsEnabled, setAnimationsEnabled } = useSettingsStore()

  if (selected === "system") {
    return (
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-light text-white/90">System</h1>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-white/80" />
              <span className="font-medium text-white/90">System sounds</span>
            </div>
            <CardDescription>Play sounds for system events</CardDescription>
          </CardHeader>
          <CardContent>
            <Switch checked={soundsEnabled} onCheckedChange={setSoundsEnabled} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-white/80" />
              <span className="font-medium text-white/90">Animation effects</span>
            </div>
            <CardDescription>Window animations and transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selected === "display") {
    return (
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-light text-white/90">Display</h1>
        <Card>
          <CardHeader>
            <CardDescription>Brightness and color settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-[#60cdff] to-[#0078d4] rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selected === "sound") {
    return (
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-light text-white/90">Sound</h1>
        <Card>
          <CardHeader>
            <CardDescription>Master volume (preview)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-[#60cdff] to-[#0078d4] rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (selected === "network") {
    return (
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-light text-white/90">Network</h1>
        <p className="text-sm text-white/60">Wi-Fi and networking controls are coming soon.</p>
      </div>
    )
  }

  if (selected === "privacy") {
    return (
      <div className="space-y-4 max-w-xl">
        <h1 className="text-2xl font-light text-white/90">Privacy</h1>
        <p className="text-sm text-white/60">Privacy controls are coming soon.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-light text-white/90">About</h1>
      <Card>
        <CardHeader>
          <CardDescription>Portfolio OS environment</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/80">Windows 11 style portfolio desktop built with Next.js and React.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function Settings() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return categories

    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(normalizedQuery) ||
        cat.description.toLowerCase().includes(normalizedQuery),
    )
  }, [searchQuery])

  if (selectedCategory) {
    return (
      <div className="flex h-full bg-[#202020]">
        <CategorySidebar selected={selectedCategory} onSelect={setSelectedCategory} onBack={() => setSelectedCategory(null)} />
        <div className="flex-1 p-6 overflow-auto">
          <CategoryContent selected={selectedCategory} />
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[#202020] p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white/90 mb-4">Settings</h1>
        <div className="flex items-center gap-3 bg-[#2d2d2d] rounded-lg px-4 py-3 border border-[#3d3d3d] max-w-md">
          <input
            type="text"
            placeholder="Find a setting"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-start gap-4 p-4 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] hover:bg-[#353535] transition-colors text-left"
            >
              <Icon className="h-7 w-7 text-[#60cdff] mt-0.5" />
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-white/90">{category.title}</h3>
                <p className="text-xs text-white/50 mt-0.5 line-clamp-1">{category.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

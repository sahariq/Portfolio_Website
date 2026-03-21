// Sample categories array. Adjust icon paths and details as needed.
const categories = [
  {
    id: "system",
    title: "System",
    description: "System settings and preferences",
    icon: (props: React.ComponentProps<'img'>) => <img src="/this pc.ico" alt="System" {...props} />,
  },
  {
    id: "display",
    title: "Display",
    description: "Display and appearance settings",
    icon: (props: React.ComponentProps<'img'>) => <img src="/Desktop.ico" alt="Display" {...props} />,
  },
  {
    id: "sound",
    title: "Sound",
    description: "Sound and audio settings",
    icon: (props: React.ComponentProps<'img'>) => <img src="/Audio.ico" alt="Sound" {...props} />,
  },
  {
    id: "network",
    title: "Network",
    description: "Wi-Fi and network settings",
    icon: (props: React.ComponentProps<'img'>) => <img src="/Network.ico" alt="Network" {...props} />,
  },
  {
    id: "privacy",
    title: "Privacy",
    description: "Privacy and permissions",
    icon: (props: React.ComponentProps<'img'>) => <img src="/Lock.ico" alt="Privacy" {...props} />,
  },
  {
    id: "about",
    title: "About",
    description: "App version and info",
    icon: (props: React.ComponentProps<'img'>) => <img src="/Info.ico" alt="About" {...props} />,
  },
]
"use client"


import { useState } from "react"



import { useSettingsStore } from "@/store/settings-store"
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"


export function Settings() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const { soundsEnabled, animationsEnabled, setSoundsEnabled, setAnimationsEnabled } = useSettingsStore()

  const filteredCategories = categories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedCategory === "system") {
    return (
      <div className="flex h-full bg-[#202020]">
        {/* Sidebar */}
        <div className="w-64 bg-[#252525] border-r border-[#3d3d3d] p-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4"
          >
            <img src="/icons/chevron-right.svg" alt="Back" className="h-4 w-4 rotate-180" />
            Back to Settings
          </button>

          <div className="space-y-1">
            {categories.slice(0, 5).map((cat) => {
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-left transition-colors",
                    selectedCategory === cat.id ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <CatIcon className="h-5 w-5 text-white/70" />
                  <span className="text-sm text-white/90">{cat.title}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center gap-3 mb-6">
            <img src="/icons/monitor.svg" alt="System" className="h-8 w-8" style={{ color: '#60cdff' }} />
            <h1 className="text-2xl font-light text-white/90">System</h1>
          </div>

          <div className="space-y-3 max-w-xl">
            <h2 className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">Sound & Effects</h2>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src="/icons/volume.svg" alt="System sounds" className="h-5 w-5" />
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
                  <img src="/icons/sparkles.svg" alt="Animation effects" className="h-5 w-5" />
                  <span className="font-medium text-white/90">Animation effects</span>
                </div>
                <CardDescription>Window animations and transitions</CardDescription>
              </CardHeader>
              <CardContent>
                <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
              </CardContent>
            </Card>

            <div className="pt-4">
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-wide mb-3">Display</h2>

              <div className="bg-[#2d2d2d] rounded-lg p-4 border border-[#3d3d3d]">
                <h3 className="text-sm font-medium text-white/90 mb-2">Brightness and color</h3>
                <p className="text-xs text-white/50">Adjust display brightness and night light settings.</p>
                <div className="mt-3 h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#60cdff] to-[#0078d4] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (selectedCategory === "display") {
    return (
      <div className="flex h-full bg-[#202020]">
        {/* Sidebar */}
        <div className="w-64 bg-[#252525] border-r border-[#3d3d3d] p-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4"
          >
            <img src="/icons/chevron-right.svg" alt="Back" className="h-4 w-4 rotate-180" />
            Back to Settings
          </button>
          <div className="space-y-1">
            {categories.slice(0, 5).map((cat) => {
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-left transition-colors",
                    selectedCategory === cat.id ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <CatIcon className="h-5 w-5 text-white/70" />
                  <span className="text-sm text-white/90">{cat.title}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center gap-3 mb-6">
            <img src="/Desktop.ico" alt="Display" className="h-8 w-8" style={{ color: '#60cdff' }} />
            <h1 className="text-2xl font-light text-white/90">Display</h1>
          </div>
          <div className="space-y-4 max-w-xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src="/icons/moon.svg" alt="Theme" className="h-5 w-5" />
                  <span className="font-medium text-white/90">Dark mode</span>
                </div>
                <CardDescription>Enable dark theme for the interface</CardDescription>
              </CardHeader>
              <CardContent>
                <Switch checked={true} onCheckedChange={() => {}} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src="/icons/font.svg" alt="Font size" className="h-5 w-5" />
                  <span className="font-medium text-white/90">Font size</span>
                </div>
                <CardDescription>Adjust the font size (coming soon)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-[#60cdff] to-[#0078d4] rounded-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (selectedCategory === "sound") {
    return (
      <div className="flex h-full bg-[#202020]">
        {/* Sidebar */}
        <div className="w-64 bg-[#252525] border-r border-[#3d3d3d] p-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4"
          >
            <img src="/icons/chevron-right.svg" alt="Back" className="h-4 w-4 rotate-180" />
            Back to Settings
          </button>
          <div className="space-y-1">
            {categories.slice(0, 5).map((cat) => {
              const CatIcon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2 rounded-md text-left transition-colors",
                    selectedCategory === cat.id ? "bg-white/10" : "hover:bg-white/5",
                  )}
                >
                  <CatIcon className="h-5 w-5 text-white/70" />
                  <span className="text-sm text-white/90">{cat.title}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex items-center gap-3 mb-6">
            <img src="/Audio.ico" alt="Sound" className="h-8 w-8" style={{ color: '#60cdff' }} />
            <h1 className="text-2xl font-light text-white/90">Sound</h1>
          </div>
          <div className="space-y-4 max-w-xl">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src="/icons/volume.svg" alt="Master volume" className="h-5 w-5" />
                  <span className="font-medium text-white/90">Master volume</span>
                </div>
                <CardDescription>Adjust the system volume (coming soon)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-2 bg-[#3d3d3d] rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-[#60cdff] to-[#0078d4] rounded-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <img src="/icons/mute.svg" alt="Mute" className="h-5 w-5" />
                  <span className="font-medium text-white/90">Mute</span>
                </div>
                <CardDescription>Mute all system sounds</CardDescription>
              </CardHeader>
              <CardContent>
                <Switch checked={false} onCheckedChange={() => {}} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[#202020] p-6 overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white/90 mb-4">Settings</h1>

        {/* Search */}
        <div className="flex items-center gap-3 bg-[#2d2d2d] rounded-lg px-4 py-3 border border-[#3d3d3d] max-w-md">
          <img src="/Search.ico" alt="Search" className="h-5 w-5 text-white/50" />
          <input
            type="text"
            placeholder="Find a setting"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-2 gap-3 max-w-2xl">
        {filteredCategories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-start gap-4 p-4 bg-[#2d2d2d] rounded-lg border border-[#3d3d3d] hover:bg-[#353535] transition-colors text-left"
            >
              <Icon className="h-7 w-7" style={{ color: '#60cdff', marginTop: '0.125rem' }} />
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"
import { ToastAction } from "./components/ui/toast"
import APIProvider from "./components/api-provider"
import Dashboard from "./components/tabs/dashboard"
import { ConstructToastMessage } from "./lib/utils"
import { Toaster } from "./components/ui/toaster"
import Settings from "./components/tabs/settings"
import Background from "./components/background"
import History from "./components/tabs/history"
import Search from "./components/tabs/search"
import { useToast } from "./hooks/use-toast"
import { useEffect, useState } from "react"
import confetti from "canvas-confetti";

const ban_emoji = confetti.shapeFromText({ text: '🔨', scalar: 2 })
const ban_confettiOptions = {
  particleCount: 100,
  angle: -90,
  spread: 100,
  startVelocity: 25,
  decay: 1,
  gravity: 1,
  drift: 0,
  flat: true,
  ticks: 200,
  origin: {
    x: 0.5,
    y: -1,
  },
  scalar: 2,
  shapes: [ban_emoji]
}
const kick_emoji = confetti.shapeFromText({ text: '🥾', scalar: 2 })
const kick_confettiOptions = {
  particleCount: 100,
  angle: -90,
  spread: 100,
  startVelocity: 25,
  decay: 1,
  gravity: 1,
  drift: 0,
  flat: true,
  ticks: 200,
  origin: {
    x: 0.5,
    y: -1,
  },
  scalar: 2,
  shapes: [kick_emoji]
}

const AppTabs = [
  {
    label: "Dashboard",
    component: Dashboard,
  },
  {
    label: "Search",
    component: Search,
  },
  {
    label: "History",
    component: History,
  },
  {
    label: "Settings",
    component: Settings,
  }
]
const TabsDefault = AppTabs[0].label;

function App(): JSX.Element {
  const { toast } = useToast();

  useEffect(() => {
    window.electron.ipcRenderer.on('error-no-console-key', () => {
      toast({
        variant: 'destructive',
        title: "No Console Key",
        description: "You need to set a console key in the settings to use this feature.",
        action: (
          <ToastAction altText="Open Settings" onClick={() => {
            setTab("Settings");
          }} className="border-2 border-black">Open Settings</ToastAction>
        )
      })
    })

    window.electron.ipcRenderer.on('command-response', (_, response) => {
      if (response.error) {
        toast({
          variant: 'destructive',
          title: "Command Error",
          description: response.error,
        })
      } else {
        toast({
          title: "Command Success",
          description: ConstructToastMessage(response.command),
        })
        const commandType = response.command.type
        if (commandType === "ban") {
          confetti(ban_confettiOptions)
        } else if (commandType === "kick") {
          confetti(kick_confettiOptions)
        }

        window.electron.ipcRenderer.on('player-data', (_, data) => {
          setPlayers(data);
        })
      }

      return () => {
        window.electron.ipcRenderer.removeAllListeners('error-no-console-key')
        window.electron.ipcRenderer.removeAllListeners('command-response')
        window.electron.ipcRenderer.removeAllListeners('player-data')
      }
    })
  }, [])

  const [players, setPlayers] = useState([]);
  const [tab, setTab] = useState(TabsDefault);

  const onTabChange = (value: string) => {
    setTab(value);
  }

  return (
    <Background>
      <APIProvider>
        <Tabs value={tab} onValueChange={onTabChange}>
          <TabsList className={`grid grid-flow-col grid-cols-${AppTabs.length}`}>
            {AppTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.label}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {AppTabs.map((tab) => (
            <TabsContent key={tab.label} value={tab.label}>
              {/* TODO: Potentially use dynamic props: {...props} */}
              <tab.component players={players} />
            </TabsContent>
          ))}
        </Tabs>
        <Toaster />
      </APIProvider>
    </Background>
  )
}

export default App

import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import { ConfettiOptions, ConstructToastMessage } from "./lib/utils";
import { createElement, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import APIProvider from "./components/api-provider";
import Dashboard from "./components/tabs/dashboard";
import { ToastAction } from "./components/ui/toast";
import Settings from "./components/tabs/settings";
import { Toaster } from "./components/ui/toaster";
import AppSidebar from "./components/app-sidebar"
import Background from "./components/background"
import History from "./components/tabs/history";
import { setPlayers, setServer } from "./main";
import Search from "./components/tabs/search";
import { useToast } from "./hooks/use-toast";
import { IPCEvent } from "./lib/events";
import confetti from "canvas-confetti";

type Tab = "Dashboard" | "Search" | "History" | "Settings";

const AppTabs = {
    "Dashboard": Dashboard,
    "Search": Search,
    "History": History,
    "Settings": Settings
}

function App() {
    const { toast } = useToast();

    const handleErrorNoConsoleKey = () => {
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
    }

    const handleCommandResponse = (_, response: CommandEvent) => {
        toast({
            variant: response.error ? 'destructive' : 'default',
            title: response.error ? "Command Error" : "Command Success",
            description: response.error ? response.error : ConstructToastMessage(response.command),
        })

        const cType = response.command.type
        ConfettiOptions[cType] && confetti(ConfettiOptions[cType]);
    }

    const handlePlayerData = (_, data: ParsedPlayerData) => {
        setPlayers(data.players);
        setServer(data.server);
    }

    useEffect(() => {
        const Events = [
            IPCEvent('error-no-console-key', handleErrorNoConsoleKey),
            IPCEvent('command-response', handleCommandResponse),
            IPCEvent('player-data', handlePlayerData)
        ]

        return () => {
            Events.forEach((RemoveIPCEvent) => {
                RemoveIPCEvent();
            })
        }
    }, [])

    const [tab, setTab] = useState<Tab>("Dashboard");

    function onTabChange(tab: string) {
        setTab(tab as Tab);
    }

    return (
        <APIProvider>
            <Background>
                <div className="bg-background/50 backdrop-blur-[2px]">
                    <SidebarProvider>
                        <AppSidebar onTabChange={onTabChange} />
                        <main className="w-svw h-svh overflow-hidden">
                            <SidebarTrigger />
                            <AnimatePresence>
                                {AppTabs[tab] && (
                                    <motion.div
                                        key={tab}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="h-full w-full"
                                    >
                                        {createElement(AppTabs[tab])}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </SidebarProvider>
                </div>
            </Background>
            <Toaster />
        </APIProvider>
    )
}

export default App
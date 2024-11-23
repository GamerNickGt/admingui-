import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import APIProvider from "./components/api-provider";
import Dashboard from "./components/tabs/dashboard";
import Settings from "./components/tabs/settings";
import AppSidebar from "./components/app-sidebar"
import Background from "./components/background"
import { createElement, useState } from "react";
import History from "./components/tabs/history";
import Search from "./components/tabs/search";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "Dashboard" | "Search" | "History" | "Settings";

const AppTabs = {
    "Dashboard": Dashboard,
    "Search": Search,
    "History": History,
    "Settings": Settings
}

function App() {
    const [tab, setTab] = useState<Tab>("Dashboard");
    const [server, setServer] = useState<string>("");
    const [players, setPlayers] = useState<Player[]>([{
        displayName: "Ⱥ Smiggy",
        playfabId: "6F33D568A08FF682"
    }]);

    function onTabChange(tab: string) {
        setTab(tab as Tab);
    }

    return (
        <APIProvider server={server}>
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
                                        {createElement(AppTabs[tab], { players })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </main>
                    </SidebarProvider>
                </div>
            </Background>
        </APIProvider>
    )
}

export default App
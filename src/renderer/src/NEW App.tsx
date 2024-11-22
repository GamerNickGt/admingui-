import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar"
import APIProvider from "./components/api-provider";
import Dashboard from "./components/tabs/dashboard";
import Settings from "./components/tabs/settings";
import AppSidebar from "./components/app-sidebar"
import Background from "./components/background"
import { createElement, useState } from "react";
import History from "./components/tabs/history";
import Search from "./components/tabs/search";

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
        displayName: "𝐛ruh",
        playfabId: "1234567890"
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
                        <main className="w-svw h-svh">
                            <SidebarTrigger />
                            {AppTabs[tab] && createElement(AppTabs[tab], { players })}
                        </main>
                    </SidebarProvider>
                </div>
            </Background>
        </APIProvider>
    )
}

export default App
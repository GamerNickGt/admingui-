import { ScrollArea } from "../ui/scroll-area";
import { convertUnicode } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useAPI } from "../api-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import unidecode from "unidecode";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import PlayerDialog from "../dialogs/player";

interface DashboardProps {
    players: Player[];
}

function Dashboard({ players }: DashboardProps) {
    const [search, setSearch] = useState("");
    const { api } = useAPI();

    const player_list = players.filter((player) =>
        unidecode(convertUnicode(player.displayName)).toLowerCase().includes(unidecode(search.trim().toLowerCase())) ||
        player.playfabId.toLowerCase().includes(unidecode(search.trim().toLowerCase())) ||
        player.displayName.toLowerCase().includes(search.trim().toLowerCase())
    ).sort((a, b) => {
        return unidecode(convertUnicode(a.displayName)).localeCompare(unidecode(convertUnicode(b.displayName)))
    })

    return (
        <div className="mx-10">
            <div className="flex gap-1">
                <Button variant="outline" onClick={() => {
                    api.command({ type: 'list_players', server: 'unknown' })
                }}>
                    <RefreshCcw />
                </Button>
                <div className="grow">
                    <Input placeholder="Search by Name or ID" className="caret-white" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
            </div>
            {(search.length > 0 && (unidecode(convertUnicode(search.trim())) !== search)) && (
                <div className="p-2 mt-2 bg-chart-1/10 border-2 border-dashed rounded-sm border-chart-1/50">
                    <div className="flex items-center justify-center">
                        <span className="text-3xl animate-wiggle-more">👋</span>
                        <span className="text-xs text-muted-foreground">Looks like your search contains some 🤔 characters.</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">so we've went ahead and decoded it for you: {unidecode(convertUnicode(search.trim()))}</span>
                    </div>
                </div>
            )}
            <ScrollArea className="mt-2 mx-auto w-full">
                <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,_1fr))] gap-2">
                    {
                        player_list.length === 0 ? (
                            <div className="text-center col-span-3"></div>
                        ) : (
                            player_list.map((player) => (
                                <Card key={player.playfabId} player={player} />
                            ))
                        )
                    }
                </div>
            </ScrollArea>
        </div>
    )
}

interface CardProps {
    player: Player;
}

function Card({ player }: CardProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="p-1 rounded-lg cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm text-center">{player.displayName}</div>
                </div>
            </DialogTrigger>
            <DialogContent>
                <PlayerDialog player={player} setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}

export default Dashboard;

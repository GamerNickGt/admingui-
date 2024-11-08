import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Ban, FileUser, UserRoundMinus } from "lucide-react";
import { convertUnicode, formatSeconds } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAPI } from "../api-provider";
import { Button } from "../ui/button";
import unidecode from 'unidecode';

interface PlayerDialogProps {
    player: Player;
    setOpen?: (open: boolean) => void;
}

function PlayerDialog({ player }: PlayerDialogProps) {
    const { rate_remaining, rate_limit, last_refresh } = useAPI();
    const [secondsLeft, setSecondsLeft] = useState(60);

    useEffect(() => {
        const updateCountdown = () => {
            const elapsedTime = Date.now() - last_refresh;
            const timeLeft = Math.max(0, 60 - Math.floor(elapsedTime / 1000));
            setSecondsLeft(timeLeft);
        };

        updateCountdown();

        const intervalId = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalId);
    }, [last_refresh])

    return (
        <>
            <DialogHeader className="flex mx-auto">
                <DialogTitle className="text-neutral-200 text-center">
                    <span className="select-all">{player.displayName}</span>{" ("}
                    {unidecode(convertUnicode(player.displayName)) !== player.displayName && (
                        <span className="text-neutral-400 select-all">{convertUnicode(player.displayName)}</span>
                    )}{")"}
                </DialogTitle>
                <DialogDescription className="mx-auto select-all">{player.playfabId}</DialogDescription>
            </DialogHeader >
            <DialogFooter className="flex mx-auto">
                <div className="flex flex-col">
                    <div className="flex mx-auto gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="text-neutral-200" variant="outline">
                                    <Ban className="mr-2 h-4 w-4" />
                                    Ban
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                {/* TODO */}
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="text-neutral-200" variant="outline">
                                    <UserRoundMinus className="mr-2 h-4 w-4" />
                                    Kick
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                {/* TODO */}
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex justify-center flex-col py-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="text-neutral-200" variant="outline" size="sm">
                                    <FileUser className="mr-2 h-4 w-4" />
                                    View Additional Information
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                {/* TODO */}
                            </DialogContent>
                        </Dialog>
                        <p className="text-sm text-neutral-400">Rate Limit: {rate_remaining}/{rate_limit} | Refresh in: {formatSeconds(secondsLeft)}</p>
                    </div>
                </div>
            </DialogFooter>
        </>
    )
}

export default PlayerDialog;
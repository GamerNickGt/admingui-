import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "../ui/dialog";
import { Ban, FileUser, UserRoundMinus } from "lucide-react";
import PlayerName from "../player-name";
import { Button } from "../ui/button";
import RateLimit from "../rate-limit";
import PunishDialog from "./punish";
import StatDialog from "./stats";

interface PlayerDialogProps {
    player: Player;
    setOpen?: (open: boolean) => void;
}

function PlayerDialog({ player, setOpen }: PlayerDialogProps) {
    return (
        <>
            <DialogHeader className="flex mx-auto">
                <DialogTitle className="text-center">
                    <PlayerName name={player.displayName} />
                </DialogTitle>
                <DialogDescription className="mx-auto select-all">{player.playfabId}</DialogDescription>
            </DialogHeader >
            <DialogFooter className="flex mx-auto">
                <div className="flex flex-col">
                    <div className="flex mx-auto gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Ban className="mr-2 h-4 w-4" />
                                    Ban
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <PunishDialog type="ban" player={player} setOpen={setOpen} />
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <UserRoundMinus className="mr-2 h-4 w-4" />
                                    Kick
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <PunishDialog type="kick" player={player} setOpen={setOpen} />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <div className="flex justify-center flex-col py-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <FileUser className="mr-2 h-4 w-4" />
                                    View Additional Information
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <StatDialog player={player} />
                            </DialogContent>
                        </Dialog>
                        <RateLimit />
                    </div>
                </div>
            </DialogFooter>
        </>
    )
}

export default PlayerDialog;
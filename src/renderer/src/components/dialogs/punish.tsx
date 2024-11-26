import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { duration, reason, server, setDuration, setReason } from "@/main";
import { PunishmentSelector } from "../ui/punishment-selector";
import { useSignals } from "@preact/signals-react/runtime";
import { FloatingLabelInput } from "../ui/floating-input";
import { Separator } from "../ui/separator";
import { createForm } from "@/lib/forms";
import { useAPI } from "../api-provider";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { clamp } from "@/lib/utils";
import { useState } from "react";
import { z } from "zod";

interface PunishDialogProps {
    type: | 'kick' | 'ban';
    player: Player;
    setOpen?: (open: boolean) => void;
}

const PunishmentSchema = z.object({
    reason: z.string().min(1, {
        message: "Reason is required",
    }),
    duration: z.coerce.number().int().min(1, {
        message: "Duration is required",
    }).max(999999, {
        message: "Duration is too long",
    })
})

function PunishDialog({ type, player, setOpen }: PunishDialogProps) {
    const [selectedPunishments, setSelectedPunishments] = useState<Punishment[]>([]);
    const { api } = useAPI();
    useSignals();

    const form = createForm(PunishmentSchema, { reason: reason.value, duration: duration.value.avg });
    function onSubmit(data: z.infer<typeof PunishmentSchema>) {
        api.command({ type, player, ...data, server: server.value })
        setOpen?.(false);
        setReason(data.reason);
        setDuration({ ...duration.value, avg: data.duration });
    }

    function onPunishmentChange(punishments: Punishment[]) {
        const minDuration = Math.max(...punishments.map(({ min_duration }) => min_duration));
        const maxDuration = Math.max(...punishments.map(({ max_duration }) => max_duration));
        const duration = clamp(minDuration, maxDuration, Math.floor((maxDuration + minDuration) / 2));
        const reason = punishments.map(({ reason }) => reason).join(", ");

        setSelectedPunishments(punishments);
        setDuration({ min: minDuration, max: maxDuration, avg: duration });
        setReason(reason);
    }

    return (
        <>
            <DialogHeader className="flex justify-center">
                <DialogTitle className="text-center capitalize">
                    {type} {player.displayName}
                </DialogTitle>
                <DialogDescription className="text-center">You are about to {type} {player.displayName} ({player.playfabId})</DialogDescription>
            </DialogHeader>

            <PunishmentSelector className="w-full" onChange={onPunishmentChange} />

            {(type === 'ban' && selectedPunishments.length > 0) && (<>{
                duration.value.max !== duration.value.min ? (
                    <Slider min={duration.value.min} max={duration.value.max} value={[duration.value.avg]} step={1} className="p-4" onValueChange={(value) => {
                        setDuration({ ...duration.value, avg: value[0] })
                    }} />
                ) : (
                    <div className="text-xs p-2 text-center bg-background/50 border border-border/50 rounded-lg flex flex-col">
                        <span>
                            One or more of the selected punishments do not allow for a custom duration. (min: {duration.value.min} hours, max: {duration.value.max} hours)
                        </span>
                    </div>
                )}
            </>)}

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {['reason', 'duration'].map((_key) => {
                        if (_key === 'duration' && type === 'kick') return;

                        const key = _key as 'reason' | 'duration';
                        const displayKey = key === 'reason' ? 'Reason' : 'Duration';

                        return (
                            <FormField key={key} control={form.control} name={key} render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FloatingLabelInput label={displayKey} {...field} type={key === "duration" ? "number" : "text"} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        )
                    })}
                    <Button type="submit" variant="outline" className="w-full">
                        {(() => {
                            const icon = type === "ban" ? "🔨" : "🥾";

                            const animationVariants = {
                                swing: {
                                    x: [0, 2, -2, 1, -1, 0],
                                    y: [0, 5, -5, 2.5, -2.5, 0],
                                    rotate: [0, -30, 30, -15, 15, 0],
                                    transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
                                },
                                kick: {
                                    rotate: [0, 90, -20, 30, -10, 0],
                                    x: [0, -5, 20, -5, 0],
                                    y: [0, 0, -5, 0, 0],
                                    transition: {
                                        duration: 1.2,
                                        times: [0, 0.4, 0.6, 0.8, 1],
                                        ease: ["easeOut", "easeIn", "easeOut", "easeInOut"],
                                        repeat: Infinity,
                                    },
                                },
                            };

                            return (
                                <motion.span
                                    animate={type === "ban" ? "swing" : "kick"}
                                    variants={animationVariants}
                                >
                                    {icon}
                                </motion.span>
                            );
                        })()}
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default PunishDialog;
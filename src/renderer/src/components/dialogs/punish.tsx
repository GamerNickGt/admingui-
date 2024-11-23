import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { PunishmentSelector } from "../ui/punishment-selector";
import { clamp, createForm } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { useAPI } from "../api-provider";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Input } from "../ui/input";
import { useState } from "react";
import { z } from "zod";

import { motion } from "framer-motion";

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
    const [maxDuration, setMaxDuration] = useState(1);
    const [minDuration, setMinDuration] = useState(1);

    const { api } = useAPI();
    const { reason, setReason, duration, setDuration } = api;

    const form = createForm(PunishmentSchema, { reason, duration });

    function onSubmit(data: z.infer<typeof PunishmentSchema>) {
        api.command({ type, player, ...data, server: api.server() })
        setOpen?.(false);
        setReason(data.reason);
        setDuration(data.duration);
    }

    function onPunishmentChange(punishments: Punishment[]) {
        const minDuration = Math.max(...punishments.map(({ min_duration }) => min_duration));
        const maxDuration = Math.max(...punishments.map(({ max_duration }) => max_duration));
        const duration = clamp(minDuration, maxDuration, Math.floor((maxDuration + minDuration) / 2));
        const reason = punishments.map(({ reason }) => reason).join(", ");

        setSelectedPunishments(punishments);
        setMinDuration(minDuration);
        setMaxDuration(maxDuration);
        setDuration(duration);
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
                maxDuration !== minDuration ? (
                    <Slider min={minDuration} max={maxDuration} value={[duration]} step={1} className="p-4" onValueChange={(value) => setDuration(value[0])} />
                ) : (
                    <div className="text-xs p-2 text-center bg-background/50 border border-border/50 rounded-lg flex flex-col">
                        <span>
                            One or more of the selected punishments do not allow for a custom duration. (min: {minDuration} hours, max: {maxDuration} hours)
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
                                    <FormLabel className="capitalize">{key}</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={key === 'duration' ? duration : reason} placeholder={displayKey} {...field} type={key === "duration" ? "number" : "text"} />
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
// {type === 'ban' ? '🔨' : '🥾'}
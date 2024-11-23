import { useEffect, useState } from "react";
import { formatSeconds } from "@/lib/utils";
import { useAPI } from "./api-provider";

import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

function RateLimit() {
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
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.1 }}
            className="flex flex-row"
        >
            <div className="p-2 mt-2 bg-chart-1/10 border-2 border-dashed rounded-sm rounded-r-none border-chart-1/50">
                <div className="flex flex-row gap-2 items-center">
                    <span className="text-xs text-muted-foreground">Rate Limit</span>
                    <Badge className="bg-chart-1 hover:bg-blue-400 text-foreground rounded-md">{rate_remaining}/{rate_limit}</Badge>
                </div>
            </div>
            <div className="p-2 mt-2 bg-chart-1/10 border-2 border-dashed rounded-sm rounded-l-none border-chart-1/50">
                <div className="flex flex-row gap-2 items-center">
                    <span className="text-xs text-muted-foreground">Refresh in</span>
                    <Badge className="bg-chart-1 hover:bg-blue-400 text-foreground rounded-md">{formatSeconds(secondsLeft)}</Badge>
                </div>
            </div>
        </motion.div>
    )
}

export default RateLimit;
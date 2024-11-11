import { useEffect, useState } from "react";
import { formatSeconds } from "@/lib/utils";
import { useAPI } from "./api-provider";

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

    return <p className="text-sm">Rate Limit: {rate_remaining}/{rate_limit} | Refresh in: {formatSeconds(secondsLeft)}</p>
}

export default RateLimit;
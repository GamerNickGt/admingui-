import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { GetLevelFromXP } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useAPI } from "../api-provider";
import PlayerName from "../player-name";
import APIRate from "../api-rate";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

interface ChartData {
    class: string;
    xp: number;
}

const chartConfig = {
    xp: {
        label: 'Level',
        color: "hsl(var(--chart-1))"
    }
} satisfies ChartConfig

const FillChartData = (data: PlayerDetails, setChartData: (data: ChartData[]) => void) => {
    setChartData(["experienceFootman", "experienceArcher", "experienceVanguard", "experienceKnight"].map((key) => {
        const classKey = key.split("experience")[1];
        return {
            class: classKey,
            xp: GetLevelFromXP(data.leaderboardStats[key])
        }
    }));
}

interface ExtraStatDialogProps {
    player: Player;
}

function ExtraStatDialog({ player }: ExtraStatDialogProps) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [level, setLevel] = useState<number>(0);
    const [favWeapon, setFavWeapon] = useState<string>("");
    const [requestFailed, setRequestFailed] = useState(false);
    const { api, rate_remaining } = useAPI();

    useEffect(() => {
        if (rate_remaining > 0) {
            api.fetchPlayerData(player.playfabId).then((data) => {
                if (data) {
                    FillChartData(data, setChartData);
                    setLevel(GetLevelFromXP(data.leaderboardStats.globalXp));

                    const stats = data.leaderboardStats as Record<string, number>;
                    const weapon_stats = Object.entries(stats).filter(([key, _]) => key.startsWith("experienceWeapon") && !key.endsWith("Position"))
                        .sort((a, b) => b[1] - a[1]);
                    if (weapon_stats.length > 0) {
                        setFavWeapon(weapon_stats[0][0].split("experienceWeapon")[1]);
                    }
                } else {
                    setRequestFailed(true);
                }
            })
        }
    }, []);

    return (
        <>
            <DialogHeader className="flex mx-auto">
                <DialogTitle className="text-center">
                    <PlayerName name={player.displayName} />
                </DialogTitle>
                <DialogDescription className="mx-auto select-all">
                    {player.playfabId}
                </DialogDescription>
            </DialogHeader>

            <APIRate condition={chartData.length > 0} requestFailed={requestFailed} component={chartData.length > 0 ? (
                <div className="flex-1 pb-0">
                    <p>Level: {level}</p>
                    <p>Most used Weapon: {favWeapon}</p>

                    <ChartContainer config={chartConfig} className="mx-auto">
                        <RadarChart data={chartData}>
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <PolarAngleAxis dataKey="class" />
                            <PolarGrid />
                            <Radar dataKey="xp" fill="var(--color-xp)" fillOpacity={0.6} />
                        </RadarChart>
                    </ChartContainer>
                </div>
            ) : null} />
        </>
    )
}

export default ExtraStatDialog;
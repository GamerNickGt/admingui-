import { useAPI } from "./api-provider";
import { statusMap } from "@/lib/api";
import { cloneElement } from "react";

interface APIRateProps {
    condition: any | null;
    component: React.ReactElement | null;
    requestFailed: boolean;
    requestStatus: number;
}

function APIRate({ condition, component, requestFailed, requestStatus }: APIRateProps) {
    const rate_remaining = useAPI().rate_remaining;

    const conditionMet = () => {
        return condition !== null;
    }

    return (
        <>
            {conditionMet() ? (
                component && cloneElement(component)
            ) : rate_remaining === 0 ? (
                <div className="flex mx-auto">
                    <span className="text-red-400 text-center">
                        Rate Limit Reached!
                    </span>
                </div>
            ) : requestFailed ? (
                <div className="flex mx-auto flex-col">
                    <span className="text-red-400 text-center">
                        {statusMap[requestStatus.toString()]}
                    </span>
                </div>
            ) : (
                <div className="flex mx-auto">
                    <span className="text-gray-400 text-center">
                        Loading...
                    </span>
                </div>
            )}
        </>
    )
}

export default APIRate;
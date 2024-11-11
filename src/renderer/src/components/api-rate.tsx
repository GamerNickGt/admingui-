import { cloneElement } from "react";
import { useAPI } from "./api-provider";

interface APIRateProps {
    condition: any | null;
    component: React.ReactElement | null;
    requestFailed: boolean;
}

function APIRate({ condition, component, requestFailed }: APIRateProps) {
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
                        Failed to fetch data!
                    </span>
                    <span className="text-gray-400 text-center">
                        Please try again later.
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
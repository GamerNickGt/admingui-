import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string;
    children?: React.ReactNode;
}

function Container({ className, children }: ContainerProps) {
    return (
        <div className={cn("rounded-lg border border-border/50 bg-background/50 p-4 backdrop-blur-[2px] m-2", className)}>
            {children}
        </div>
    )
}

export default Container;
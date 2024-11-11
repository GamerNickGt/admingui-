import { cn } from "@/lib/utils";

interface ContainerProps {
    className?: string;
    children?: React.ReactNode;
}

function Container({ className, children }: ContainerProps) {
    return (
        <main className="container mx-auto flex min-w-screen flex-col gap-4 p-4">
            <div className={cn("relative flex flex-1 flex-col rounded-lg border  border-border/50 bg-background/50 p-4 backdrop-blur-[2px]", className)}>
                {children}
            </div>
        </main>
    )
}

export default Container;
interface BackgroundProps {
    children?: React.ReactNode;
}

function Background({ children }: BackgroundProps) {
    return (
        <div className="min-h-screen w-full relative dark">
            {children}
            <div className="fixed inset-0 z-[-1] bg-transparent h-screen w-screen bg-custom-gradient">
                <div className="w-full h-full bg-custom-grid" />
            </div>
        </div>
    )
}

export default Background;
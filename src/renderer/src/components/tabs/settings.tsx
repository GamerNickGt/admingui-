import ConsoleKeySettings from "../settings/console-key";

function Settings() {
    return (
        <>
            <div className="flex flex-col gap-2 w-full h-[calc(100vh_-_105px)]">
                <ConsoleKeySettings />
            </div>
        </>
    )
}

export default Settings;
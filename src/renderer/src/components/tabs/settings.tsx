import ConsoleKeySettings from "../settings/console-key";
import Credits from "../settings/credits";

function Settings() {
    return (
        <>
            <div className="flex flex-col gap-2 w-full h-[calc(100vh_-_105px)]">
                <ConsoleKeySettings />
                <Credits />
            </div>
        </>
    )
}

export default Settings;
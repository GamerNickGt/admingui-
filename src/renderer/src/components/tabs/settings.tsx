import ConsoleKeySettings from "../settings/console-key";
import ThemeSelector from "../settings/theme-selector";
import Container from "../container";

function Settings({ onThemeChange }) {
    return (
        <Container>
            <div className="flex flex-col gap-2 w-full h-[calc(100vh_-_105px)]">
                <ConsoleKeySettings />
                <ThemeSelector onThemeChange={onThemeChange} />
            </div>
        </Container>
    )
}

export default Settings;
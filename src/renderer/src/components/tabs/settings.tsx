import ConsoleKeySettings from "../settings/console-key";
import ThemeSelector from "../settings/theme-selector";
import Container from "../container";

function Settings({ onThemeChange }) {
    return (
        <Container className="flex flex-col gap-2">
            <ConsoleKeySettings />
            <ThemeSelector onThemeChange={onThemeChange} />
        </Container>
    )
}

export default Settings;
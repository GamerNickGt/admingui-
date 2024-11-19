import { useEffect, useState } from "react";
import { defaultThemes } from "@/lib/utils";
import ComboBox from "../ui/combobox";

function ThemeSelector({ onThemeChange }) {
    const localTheme = localStorage.getItem("theme")
    const [theme, setTheme] = useState(localTheme || 'Default');

    const updateTheme = () => {
        localStorage.setItem("theme", theme);
    }

    useEffect(() => {
        if (theme === 'Default') {
            document.documentElement.classList.add("dark");
            onThemeChange(defaultThemes.dark, 'dark');
        } else {
            document.documentElement.classList.remove("dark");
        }
        updateTheme();
    }, [theme]);

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-full">
                <div>
                    <h1>Theme Selector</h1>
                </div>
                <ComboBox options={[
                    { value: "default", label: "Default" },
                    { value: "custom", label: "Custom" },
                ]} setLabel={setTheme} />
            </div>
        </div>
    )
}

export default ThemeSelector;
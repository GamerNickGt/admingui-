import { useEffect, useRef, useState } from "react";
import { useAPI } from "../api-provider";
import { Button } from "../ui/button";

const removeListener = window.electron.ipcRenderer.removeAllListeners;
const listenFor = window.electron.ipcRenderer.on;
const send = window.electron.ipcRenderer.send;

function ConsoleKeySettings() {
    const setConsoleKey = (key) => {
        if (('vKey' in key)) setCurKey(`${key.name}[${key.vKey}]`);
    }

    const onConsoleKeyChanged = (key) => {
        if (!self.current) {
            return;
        }
        self.current.disabled = false;
        setLabel("Change Console Key");
        setConsoleKey(key);
    }

    useEffect(() => {
        listenFor('console-key-changed', (_, key) => {
            onConsoleKeyChanged(key);
        })

        api.call('get-console-key').then(setConsoleKey);

        return () => removeListener('console-key-changed');
    }, [])

    const self = useRef<HTMLButtonElement>(null);
    const [label, setLabel] = useState("Change Console Key");
    const [curKey, setCurKey] = useState("");
    const { api } = useAPI();

    const onClick = (event) => {
        send('change-console-key');
        event.currentTarget.disabled = true;
        setLabel("Press a key to set as console key");
    }

    return (
        <div>
            <div className="flex flex-col items-center justify-center h-full">
                <div>
                    <Button className="border-b-0 rounded-b-none" variant="outline" ref={self} onClick={onClick}>
                        {label}
                    </Button>
                    <div className="w-full bg-input rounded-md border border-border border-t-0 rounded-t-none">
                        <p className="text-center text-sm text-muted-foreground">({curKey})</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConsoleKeySettings;

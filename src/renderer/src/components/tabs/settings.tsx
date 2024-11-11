import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import Container from "../container";

function Settings() {
    useEffect(() => {
        window.electron.ipcRenderer.on('console-key-changed', (_, key) => {
            console.log(key)
            if (consoleKeyButton.current) {
                consoleKeyButton.current.disabled = false;
                set_ckb_label("Change Console Key")
                key.vKey && setConsoleKey(`${key.name}[${key.vKey}]`);
            }
        })

        window.electron.ipcRenderer.invoke('get-console-key').then((key) => {
            (key && key.vKey) && setConsoleKey(`${key.name}[${key.vKey}]`);
        })

        return () => {
            window.electron.ipcRenderer.removeAllListeners('console-key-changed')
        }
    }, [])

    const consoleKeyButton = useRef<HTMLButtonElement>(null);
    const [ckb_label, set_ckb_label] = useState("Change Console Key");
    const [consoleKey, setConsoleKey] = useState("");

    return (
        <div className="">
            <Container>
                <div className="flex flex-col items-center justify-center h-full">
                    <Button variant="outline" ref={consoleKeyButton} onClick={(event) => {
                        window.electron.ipcRenderer.send('change-console-key')
                        event.currentTarget.disabled = true;
                        set_ckb_label("Press a key to set as console key")
                    }}>{ckb_label}</Button>
                    <p>({consoleKey})</p>
                </div>
                <div className="flex justify-center mt-4">
                    <p className="text-center">More coming soon...</p>
                </div>
            </Container>
        </div>
    )
}

export default Settings;
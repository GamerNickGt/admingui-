import { PresetSelector } from "../ui/preset-selector";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import ComboBox from "../ui/combobox";
import { PunishmentSchema } from "@/lib/forms";

const COMBO_OPTS = [
    { label: "Admin", value: "admin" },
    { label: "Server", value: "server" },
]

function Misc() {
    return (
        <div className="mx-10">
            <div>
                <Textarea placeholder="Type your message here" className="max-h-96" />
            </div>
            <div className="mt-2 flex flex-row gap-1">
                <ComboBox options={COMBO_OPTS} />
                <PresetSelector presetKey="punishments" schema={PunishmentSchema} />
                <Button variant="outline">
                    Send
                    <SendHorizonal className="ml-1" />
                </Button>
            </div>
        </div>
    )
}

export default Misc;
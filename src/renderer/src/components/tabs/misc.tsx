import { PresetSelector } from "../ui/preset-selector";
import { AnnouncementSchema } from "@/lib/forms";
import { SendHorizonal } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import ComboBox from "../ui/combobox";
import { Separator } from "../ui/separator";

const COMBO_OPTS = [
    { label: "Admin", value: "admin" },
    { label: "Server", value: "server" },
]

function Misc() {
    return (
        <div className="mx-10">
            <div>
                <PresetSelector presetKey="announcements" schema={AnnouncementSchema} className="w-full" />
            </div>
            <Separator
                gradient
                label={<div className="border my-2 px-4 py-1 rounded-full text-muted-foreground">Or</div>}
            />
            <div>
                <Textarea placeholder="Type your message here" className="max-h-96 rounded-b-none border-b-0" />
                <ComboBox className="w-full rounded-t-none" options={COMBO_OPTS} />
            </div>
            <Separator gradient className="my-2" />
            <div>
                <Button variant="outline" className="w-full group">
                    Send
                    <SendHorizonal className="ml-1 animate-ease-in-out animate-infinite animate-duration-1000 group-hover:animate-pulse" />
                </Button>
            </div>
        </div>
    )
}

export default Misc;
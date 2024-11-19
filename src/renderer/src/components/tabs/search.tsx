import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { columns, TableColumns } from "../search-table/columns";
import { createForm, truncateAliasHistory } from "@/lib/utils";
import { DataTable } from "../ui/data-table";
import { useAPI } from "../api-provider";
import RateLimit from "../rate-limit";
import { Button } from "../ui/button";
import ComboBox from "../ui/combobox";
import Container from "../container";
import { Input } from "../ui/input";
import { useState } from "react";
import { z } from "zod";

const SearchSchema = z.object({
    search: z.string().min(1, {
        message: "Search query is required"
    })
})

function Search() {
    const [tableData, setTableData] = useState<TableColumns[]>([]);
    const [label, setLabel] = useState<string>("Name");
    const form = createForm(SearchSchema);
    const { api } = useAPI();

    function ProcessTableData(data: PlayFabDetails, search_term?: string): TableColumns {
        const player = data as TableColumns;
        const aliasHistory = player.aliasHistory.split(',');
        player.current_name = aliasHistory[aliasHistory.length - 1];

        const truncated = truncateAliasHistory(player.aliasHistory, search_term ? search_term : player.current_name);
        if (typeof truncated === "string") {
            player.truncated_aliasHistory = truncated;
        } else {
            player.truncated_aliasHistory = truncated.truncatedAliasHistory;
        }

        return player
    }

    function onSubmit(data: z.infer<typeof SearchSchema>) {
        const search = data.search;

        if (label === "Name") {
            api.nameLookup(search, 0).then((data) => {
                if (!data) return;
                setTableData(data.players.map((player) => ProcessTableData(player, search)));
            })
        } else if (label === "PlayFab ID") {
            api.fetchPlayFabData(search).then((data) => {
                if (!data) return;
                setTableData([ProcessTableData(data)] as TableColumns[])
            })
        }
    }

    return (
        <Container className="h-[calc(100vh_-_70px)]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between mb-2">
                    <div className="flex flex-row">
                        <FormField control={form.control} name="search" render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder={`Search by ${label}`} className="rounded-r-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <ComboBox options={[
                            { value: "name", label: "Name" },
                            { value: "playfabId", label: "PlayFab ID" }
                        ]} className="rounded-l-none" setLabel={setLabel} />
                    </div>
                    <Button type="submit" variant="outline" className="ml-2">Search</Button>
                </form>
                <div>
                    <DataTable columns={columns} data={tableData} />
                </div>
            </Form>
            <div className="mt-2 flex-justify-center">
                <RateLimit />
            </div>
        </Container>
    )
}

export default Search;
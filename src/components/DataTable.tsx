"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { OpenAI } from 'openai';
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Models } from "openai/resources/models.mjs"


export type ToolCall = {
  type: string,
  id: string,
  function: {
    name: string,
    arguments: string
  }
}

export type Response = {
    id: string,
    timestamp: GLfloat,
    role: "assistant" | "user" | "tool",
    content: string,
    tool_calls: ToolCall[],
    tool_call_id: string | null,
    name: string | null
}

const convoData: Response[] = [
  {
      "id": "0e08d566-df5d-4f6b-9ae1-8c6ee4972dd3",
      "timestamp": 1708125486.151514,
      "role": "assistant",
      "content": "Acme, how can I help?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "3d4b9179-60bd-4f61-9cb2-8394823596dd",
      "timestamp": 1708125491.749077,
      "role": "user",
      "content": "Right. I'm calling about this Oklahoma to Texas load. For Monday.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "c6920ffd-27cb-4ea4-ae46-9be1a6bc33f5",
      "timestamp": 1708125497.919672,
      "role": "assistant",
      "content": "Sure, can I get your name and MC?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "bc71232d-71ed-4928-ada1-983908e5371e",
      "timestamp": 1708125506.834355,
      "role": "user",
      "content": "Eight three seven eight five eight.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "ce298fcb-b02a-46eb-b029-13c37f01a8b7",
      "timestamp": 1708125507.591786,
      "role": "assistant",
      "content": "Thanks! Can I get your name as well?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "6f4bf3ee-5e5d-4e9c-8ddf-9d9c5e4c2e3b",
      "timestamp": 1708125513.332438,
      "role": "user",
      "content": "My name is George.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "c3696660-5570-48e3-a972-001f1a691a50",
      "timestamp": 1708125514.649681,
      "role": "assistant",
      "content": "Thanks George, one sec.",
      "tool_calls": [
          {
              "type": "function",
              "id": "call_U44wtR3uubHGGekJKWEyy6yX",
              "function": {
                  "name": "verify_carrier",
                  "arguments": "{\"carrier_reference_number\": \"837858\"}"
              }
          }
      ],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "4bcb5952-8969-48a6-ae46-1a2153c7066a",
      "timestamp": 1708125516.857669,
      "role": "tool",
      "content": "{\"success\":false,\"data\":null,\"error\":\"No carriers found. Ask user to repeat their MC or DOT number.\"}",
      "tool_calls": [],
      "tool_call_id": "call_U44wtR3uubHGGekJKWEyy6yX",
      "name": "verify_carrier"
  },
  {
      "id": "131111e4-c8ad-4b7f-81b2-885a1f34d5b9",
      "timestamp": 1708125517.956045,
      "role": "assistant",
      "content": "Hmm, weird, couldn't find you guys. Could you repeat your MC number for me?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "6b659fd0-c2a0-4649-b3d6-de193dc46c09",
      "timestamp": 1708125526.659741,
      "role": "user",
      "content": "Eight three seven eight five eight.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "4c119ab9-6468-443b-ac23-dfa3f2d82298",
      "timestamp": 1708125527.703506,
      "role": "assistant",
      "content": "Let me try that again.",
      "tool_calls": [
          {
              "type": "function",
              "id": "call_Jfyy2YSiRN5R48hkVjDCuG9e",
              "function": {
                  "name": "verify_carrier",
                  "arguments": "{\"carrier_reference_number\": \"837858\"}"
              }
          }
      ],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "253da07c-e280-4b94-ab76-9581f7116372",
      "timestamp": 1708125529.765125,
      "role": "tool",
      "content": "{\"success\":false,\"data\":null,\"error\":\"No carriers found. Ask user to repeat their MC or DOT number.\"}",
      "tool_calls": [],
      "tool_call_id": "call_Jfyy2YSiRN5R48hkVjDCuG9e",
      "name": "verify_carrier"
  },
  {
      "id": "380a3a73-f526-4e62-80a3-4523e9200837",
      "timestamp": 1708125530.524269,
      "role": "assistant",
      "content": "Hmm yeah cannot find you guys, all good, though. George, do you see a reference number on that posting?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "b1142e5b-481b-4261-9085-6e272a9e1725",
      "timestamp": 1708125541.860959,
      "role": "user",
      "content": "Yeah. One second.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "66695e21-fbe7-4907-a8b5-6ba6272e291e",
      "timestamp": 1708125543.498814,
      "role": "assistant",
      "content": "Sure.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "82879fe9-8f0d-4a14-a533-d018d2bd3f47",
      "timestamp": 1708125546.438467,
      "role": "user",
      "content": "The reference number one six one eight five zero three.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "ad9c7745-c497-4530-af12-432a75d2ee5e",
      "timestamp": 1708125551.272955,
      "role": "assistant",
      "content": "Got it, looking it up now.",
      "tool_calls": [
          {
              "type": "function",
              "id": "call_zqc2cQa5oWlP4qdB0GB565k6",
              "function": {
                  "name": "find_available_loads",
                  "arguments": "{\"reference_number\": \"1618503\"}"
              }
          }
      ],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "3b16e4eb-83b6-411a-95a3-629ceb2ee2f4",
      "timestamp": 1708125554.130844,
      "role": "tool",
      "content": "{\"success\":true,\"data\":{\"id\":\"1618503\",\"load_status\":\"AVAILABLE\",\"origin\":{\"city\":\"Ardmore\",\"state\":\"Oklahoma\"},\"destination\":{\"city\":\"Conroe\",\"state\":\"Texas\"},\"pickup_date\":\"Monday, February 19th between 6 am and 8 pm\",\"delivery_date\":\"Tuesday, February 20th between 8 am and 4 pm\",\"equipment_type\":\"Flatbed\",\"carrier_rate\":\"600\",\"sales_notes\":null,\"reference\":{\"commodity_type\":\"Iron\",\"weight\":45000,\"number_of_pieces\":1},\"branch\":\"chicago\"},\"error\":null}",
      "tool_calls": [],
      "tool_call_id": "call_zqc2cQa5oWlP4qdB0GB565k6",
      "name": "find_available_loads"
  },
  {
      "id": "3139240f-6b51-4f3a-a019-00f320572f64",
      "timestamp": 1708125555.240294,
      "role": "assistant",
      "content": "So umm this load is from Ardmore, Oklahoma to Conroe, Texas, picking up Monday from 6 AM to 8 PM, delivering Tuesday from 8 AM to 4 PM. It's iron, weighs forty five thousand pounds, and I'm looking for six hundred dollars. Would you like to book this load?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "39ee9e6b-f6a3-4387-839f-f27024863cbe",
      "timestamp": 1708125576.660062,
      "role": "user",
      "content": "I can do it for six fifty.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "38fbc0fa-52a7-4611-ba35-289027350c02",
      "timestamp": 1708125577.568126,
      "role": "assistant",
      "content": "I can check. George can I get your phone number and email?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "86c950c7-f85d-44c0-8b5b-3cf1d362a781",
      "timestamp": 1708125584.46947,
      "role": "user",
      "content": "Seven seven three nine five four zero five five five.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "e4348867-1dff-43b5-a331-6be9d2f5d645",
      "timestamp": 1708125588.665383,
      "role": "assistant",
      "content": "Thanks, and your email?",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "cb36b19b-75b9-4037-90fc-286c0704bda0",
      "timestamp": 1708125595.334687,
      "role": "user",
      "content": "G dot Peterpan eighty eight at Gmail dot com.",
      "tool_calls": [],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "7be713ef-9984-477c-883e-2120b7f0bbb1",
      "timestamp": 1708125601.089663,
      "role": "assistant",
      "content": "Okay, let me note this down.",
      "tool_calls": [
          {
              "type": "function",
              "id": "call_2oPdcwP2WovGWIUCCea4Z7zq",
              "function": {
                  "name": "log_and_evaluate_offer",
                  "arguments": "{\"shipment_number\": \"1618503\", \"offer_amount\": \"650\", \"carrier_id\": \"\", \"carrier_name\": \"\", \"dispatcher_name\": \"George\", \"phone_number\": \"7739540555\", \"email\": \"G.Peterpan@gmail.com\"}"
              }
          }
      ],
      "tool_call_id": null,
      "name": null
  },
  {
      "id": "e1d63f50-49e3-4451-85ed-31fb0ecd821e",
      "timestamp": 1708125603.517611,
      "role": "tool",
      "content": "{\"success\":true,\"data\":{\"message\":\"Offer ($650) is competitive. Transfer caller to carrier sales representative.\"},\"error\":null}",
      "tool_calls": [],
      "tool_call_id": "call_2oPdcwP2WovGWIUCCea4Z7zq",
      "name": "log_and_evaluate_offer"
  },
  {
      "id": "5fd2fbe6-f7ba-4943-b528-77edb9305c69",
      "timestamp": 1708125604.474753,
      "role": "assistant",
      "content": "So umm George let me transfer you to our carrier sales rep to finalize this. One moment, please.",
      "tool_calls": [
          {
              "type": "function",
              "id": "call_fkrPYpONZWaJhVcXst89zPFC",
              "function": {
                  "name": "transfer_to_carrier_sales_rep",
                  "arguments": "{}"
              }
          }
      ],
      "tool_call_id": null,
      "name": null
  }
]

const roleStyles = {
  assistant: {
    backgroundColor: '#007BFF',  // Blue
    color: 'white',
    borderRadius: '20px',
    padding: '5px 10px',
    display: 'inline-block'
  },
  user: {
    backgroundColor: '#28A745',  // Green
    color: 'white',
    borderRadius: '20px',
    padding: '5px 10px',
    display: 'inline-block'
  },
  tool: {
    backgroundColor: '#FFC107',  // Orange
    color: 'black',
    borderRadius: '20px',
    padding: '5px 10px',
    display: 'inline-block'
  }
};

export const columns: ColumnDef<Response>[] = [
  {
    accessorKey: "role",
    header: () => <div className="text-center" style={{ minWidth: '100px', width: '20%' }}>Role</div>,
    cell: ({ row }) => {
      const role = row.getValue("role") as "assistant" | "user" | "tool";
      return (
        <div style={roleStyles[role]} className="capitalize">
          {role}
        </div>
      );
    },
  },
  {
    accessorKey: "content",
    header: () => <div style={{ maxWidth: '600px' }}>&nbsp;</div>,
    cell: ({ row }) => <div className="lowercase" style={{ maxWidth: '600px' }}>{row.getValue("content")}</div>,
  },
  // {
  //   accessorKey: "amount",
  //   header: () => <div className="text-center" style={{ minWidth: '100px', width: '20%' }}>Tool Call</div>,
  //   cell: ({ row }) => {
  //     <div className="lowercase" style={{ minWidth: '100px', width: '20%' }}>{row.getValue("content")}</div>
  //   },
  // },
]

export function DataTableDemo() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable<Response>({
    data:   convoData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [command, setCommand] = React.useState('');
  require('dotenv').config();
  console.log('API Key:', process.env.OPENAI_API_KEY);
  const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
  });
  

  const handleCommandSubmit = async () => {
    console.log("Command Submitted: ", command);
    console.log("Convo Data: ", convoData);
  
    const messages = convoData.map(item => ({
      role: item.role,
      content: item.content
    }));
  
    // Append the new command from the user
    messages.push({
      role: "user", // Assuming the command is always from the user's perspective
      content: command
    });
  
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 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',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        const newText = data.choices[0].message.content; // Assuming the API response structure is correct
        console.log(newText);
        // Here you would integrate newText into your convoData or handle it as needed
      }
    } catch (error) {
      console.error('Error submitting command to OpenAI:', error);
    }
  }
  
 

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">AI Editor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Conversation</DialogTitle>
                <DialogDescription>
                  Enter what you would like changed, removed, or added to the conversation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    // defaultValue="Change the assistant's greeting."
                    placeholder="Change the assistant's greeting."
                    className="col-span-4"
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCommandSubmit}>Edit</Button>                
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table style={{ width: '100%'}}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  // colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
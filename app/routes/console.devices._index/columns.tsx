import { Link } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal, Smartphone } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Device = {
  _id: string;
  name: string;
  serialNo: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "name",
    header: "Device Name",
    // cell: ({ row }) => <p className="line-clamp-1">{row.original.name}</p>,
  },
  {
    header: "Serial No",
    accessorFn: (originalRow) => `$${originalRow.serialNo}`,
  },
  {
    id: "createdAt",
    header: "Added",
    accessorFn: (originalRow) =>
      format(new Date(originalRow.createdAt), "dd/MM/yyyy"),
  },
  {
    id: "updatedAt",
    header: "Updated",
    accessorFn: (originalRow) =>
      format(new Date(originalRow.updatedAt), "dd/MM/yyyy"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <Link
              to={`${row.original._id}`}
              className="flex w-full items-center gap-2"
            >
              <Smartphone className="size-4" />
              <span>View</span>
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>
            <Link
              to={`${row.original._id}`}
              className="flex w-full items-center gap-2"
            >
              <Trash className="size-4" />
              <span>Unlink</span>
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

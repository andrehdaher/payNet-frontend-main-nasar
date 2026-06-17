import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";





export default function DataTable({
    title,
    description,
    columns,
    data,
    searchable = true,
    className,
    pageSizeOptions = [5, 10, 20],
    defaultPageSize = 10,
    getRowClassName,
    renderRowActions,
    amountBold = false,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    const filteredData = data.filter((item) =>
        Object.values(item).some((value) =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
    );

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const renderCellContent = (value, key) => {
        if (key === "status") {
            return (
                <Badge
                    variant={value == "completed" || value == 'تم التسديد' ? "default" : value == 'جاري التسديد' ? 'secondary' : "destructive"}
                    className="capitalize text-center"
                >
                    {value}
                </Badge>
            );
        }
        if (key === "email") {
            return <span className="text-muted-foreground">{value}</span>;
        }
        if (key === "createdAt" || key === "date" || key === 'timestamp') {
            return <span className="text-muted-foreground">{new Date(value).toLocaleString("en-GB")}</span>;
        }
        if (key === "amount" && amountBold) {
            return <span className="text-primary font-extrabold text-xl">{value}</span>;
        }
        if (key === "total") {
            return (
                <span className="">
                    {value.toLocaleString("en-EG", { minimumFractionDigits: 0 })}
                </span>
            );
        }
        if (key === "avgAmount") {
            return <span>{value.toFixed(0)}</span>;
        }
        return value;
    };

    return (
        <Card className={className}>
            <CardContent className="space-y-4">
                <div className="overflow-x-auto rounded-md border">
                    <Table className="">
                        <TableHeader>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableHead className={column.hidden ? 'hidden' : 'text-center'} key={column.key}>
                                        {column.sortable ? (
                                            <Button
                                                variant="ghost"
                                                onClick={() => { handleSort(column.key); }}
                                                className={`h-auto p-0 font-medium`}
                                            >
                                                {column.label}
                                                {sortConfig?.key === column.key && (
                                                    <span className="ml-1">
                                                        {sortConfig.direction === "asc" ? "↑" : "↓"}
                                                    </span>
                                                )}
                                            </Button>
                                        ) : (
                                            column.label
                                        )}
                                    </TableHead>
                                ))}
                                {renderRowActions && <TableHead>Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        className={getRowClassName ? getRowClassName(row) : ""}
                                    >
                                        {columns.map((column) => (
                                            <TableCell className={column.hidden ? 'hidden' : ''} key={column.key}>
                                                {renderCellContent(row[column.key], column.key)}
                                            </TableCell>
                                        ))}
                                        {renderRowActions && (
                                            <TableCell>{renderRowActions(row)}</TableCell>
                                        )}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + (renderRowActions ? 1 : 0)} className="text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">عدد الاسطر :</span>
                        <select
                            className="border rounded px-2 py-1 text-sm"
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages || 1}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

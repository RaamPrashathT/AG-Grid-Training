"use client";

import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
    currentPage,
    totalPages,
    pageSize,
    onPageChange,
    onPageSizeChange,
}) => {
    let ellipsisCount = 0;

    const getVisiblePages = () => {
        const delta = 1;
        const range = [];
        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) range.unshift("...");
        if (currentPage + delta < totalPages - 1) range.push("...");

        range.unshift(1);
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    const pages = getVisiblePages();

    return (
        <div className="flex flex-col gap-4 border-t border-border bg-card px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Rows per page
                </span>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(val) => onPageSizeChange(Number(val))}
                >
                    <SelectTrigger className="h-9 w-20 border-border bg-background text-foreground">
                        <SelectValue placeholder={pageSize.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 25, 50, 100].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                                {size}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Pagination className="justify-end w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => onPageChange(currentPage - 1)}
                            className={
                                currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer border-border"
                            }
                        />
                    </PaginationItem>

                    {pages.map((page) => {
                        const key =
                            page === "..."
                                ? `ellipsis-${++ellipsisCount}`
                                : `page-${page}`;

                        return (
                            <PaginationItem key={key}>
                                {page === "..." ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        onClick={() =>
                                            onPageChange(page as number)
                                        }
                                        isActive={currentPage === page}
                                        className="cursor-pointer border-border"
                                    >
                                        {page}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() => onPageChange(currentPage + 1)}
                            className={
                                currentPage === totalPages || totalPages === 0
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer border-border"
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

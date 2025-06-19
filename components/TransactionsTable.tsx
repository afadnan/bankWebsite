'use client'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionCategoryStyles } from "@/constants";
import {
  cn,
  formatAmount,
  formatDateTime,
  getTransactionStatus,
  removeSpecialCharacters,
} from "@/lib/utils";
import { useState } from "react";

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
  } =
    transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] ||
    transactionCategoryStyles.default;

  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category}</p>
    </div>
  );
};

const TransactionsTable = ({
  transactions,
  isLoading = false,
}: TransactionTableProps & { isLoading?: boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredTransactions =
    selectedCategory === "all"
      ? transactions
      : transactions.filter((t) => t.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-md" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-500">No transactions available</p>
      </div>
    );
  }

  const categories = [
    "all",
    ...Array.from(new Set(transactions.map((t) => t.category))),
  ];

  return (
    <>
      {/* Filters */}
      <div className="flex items-center justify-end space-x-2 mb-2">
        <label className="text-sm text-gray-500">Filter by category:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 text-sm rounded-md px-3 py-1"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table>
        <TableHeader className="bg-[#f9fafb]">
          <TableRow>
            <TableHead className="px-2">Transaction</TableHead>
            <TableHead className="px-2">Amount</TableHead>
            <TableHead className="px-2">Status</TableHead>
            <TableHead className="px-2">Date</TableHead>
            <TableHead className="px-2 max-md:hidden">Channel</TableHead>
            <TableHead className="px-2 max-md:hidden">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTransactions.map((t) => {
            const status = getTransactionStatus(new Date(t.date));
            const amount = formatAmount(t.amount);
            const isDebit = t.type === "debit";
            const isCredit = t.type === "credit";

            return (
              <TableRow
                key={t.id}
                className={`${
                  isDebit || amount[0] === "-" ? "bg-[#FFFBFA]" : "bg-[#F6FEF9]"
                } !border-b-DEFAULT`}
              >
                <TableCell className="max-w-[250px] pl-2 pr-10">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(t.name)}
                  </h1>
                </TableCell>

                <TableCell
                  className={`pl-2 pr-10 font-semibold ${
                    isDebit || amount[0] === "-"
                      ? "text-[#f04438]"
                      : "text-[#039855]"
                  }`}
                >
                  {isDebit ? `-${amount}` : isCredit ? amount : amount}
                </TableCell>

                <TableCell className="pl-2 pr-10">
                  <CategoryBadge category={status} />
                </TableCell>

                <TableCell className="min-w-32 pl-2 pr-10">
                  {formatDateTime(new Date(t.date)).dateTime}
                </TableCell>

                <TableCell className="pl-2 pr-10 capitalize min-w-24">
                  {t.paymentChannel}
                </TableCell>

                <TableCell className="pl-2 pr-10 max-md:hidden">
                  <CategoryBadge category={t.category} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default TransactionsTable;

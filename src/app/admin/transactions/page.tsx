"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Plus, Search, SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { TransactionStatusBadge } from "@/components/admin/TransactionStatusBadge";
import { PaymentMethodIcon } from "@/components/admin/PaymentMethodIcon";
import { TransactionStatusFilter } from "@/components/admin/TransactionStatusFilter";
import { PaymentMethodFilter } from "@/components/admin/PaymentMethodFilter";
import { DateRangeFilter } from "@/components/admin/DateRangeFilter";
import { TransactionStatistics } from "@/components/admin/TransactionStatistics";
import { TransactionDetailsDrawer } from "@/components/admin/TransactionDetailsDrawer";

interface Transaction {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  listing?: {
    id: string;
    title: string;
  };
}

export default function TransactionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Data state
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  // Selected transaction for drawer
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState("all");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());

      if (status !== "all") params.append("status", status);
      if (paymentMethod !== "all")
        params.append("paymentMethod", paymentMethod);
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      if (searchQuery) params.append("search", searchQuery);

      const response = await fetch(
        `/api/admin/transactions?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
      setTotalTransactions(data.totalTransactions);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [page, status, paymentMethod, startDate, endDate, searchQuery]);

  useEffect(() => {
    // Parse query params on initial load
    const pageParam = searchParams.get("page");
    const statusParam = searchParams.get("status");
    const paymentMethodParam = searchParams.get("paymentMethod");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const searchParam = searchParams.get("search");
    const tabParam = searchParams.get("tab");

    if (pageParam) setPage(parseInt(pageParam));
    if (statusParam) setStatus(statusParam);
    if (paymentMethodParam) setPaymentMethod(paymentMethodParam);
    if (startDateParam) setStartDate(new Date(startDateParam));
    if (endDateParam) setEndDate(new Date(endDateParam));
    if (searchParam) setSearchQuery(searchParam);
    if (tabParam) setActiveTab(tabParam);

    fetchTransactions();
  }, [searchParams, fetchTransactions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchQuery, page: "1" });
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);

    const params: Record<string, string> = { page: "1" };
    if (start) params.startDate = start.toISOString();
    if (end) params.endDate = end.toISOString();

    updateQueryParams(params);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    updateQueryParams({ status: newStatus, page: "1" });
  };

  const handlePaymentMethodChange = (newMethod: string) => {
    setPaymentMethod(newMethod);
    updateQueryParams({ paymentMethod: newMethod, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateQueryParams({ page: newPage.toString() });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Set appropriate filters based on tab
    let newStatus = "all";
    if (value === "pending") newStatus = "PENDING";
    else if (value === "completed") newStatus = "COMPLETED";
    else if (value === "failed") newStatus = "FAILED";

    setStatus(newStatus);
    updateQueryParams({ tab: value, status: newStatus, page: "1" });
  };

  const updateQueryParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Update or add new parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    router.push(`?${newParams.toString()}`);
  };

  const openTransactionDetails = (id: string) => {
    setSelectedTransactionId(id);
    setIsDrawerOpen(true);
  };

  const handleTransactionUpdate = () => {
    fetchTransactions();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy • h:mm a");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Manage and monitor all payment transactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Manual Transaction
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 md:w-fit">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      <TransactionStatistics
        startDate={startDate}
        endDate={endDate}
        paymentMethod={paymentMethod}
        status={status}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transaction List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by ID, user, or property..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            <div className="flex flex-wrap gap-2">
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
              />
              <TransactionStatusFilter
                selectedStatus={status}
                onStatusChange={handleStatusChange}
              />
              <PaymentMethodFilter
                selectedMethod={paymentMethod}
                onMethodChange={handlePaymentMethodChange}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-500">{error}</div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions found matching your criteria.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Property</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow
                        key={transaction.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => openTransactionDetails(transaction.id)}
                      >
                        <TableCell className="font-mono text-xs">
                          {transaction.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {transaction.user.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.user.email}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatAmount(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <PaymentMethodIcon
                              method={transaction.paymentMethod}
                              className="h-4 w-4"
                            />
                            <span>{transaction.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TransactionStatusBadge status={transaction.status} />
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          {transaction.listing ? (
                            <span className="text-sm font-medium">
                              {transaction.listing.title}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              N/A
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {transactions.length} of {totalTransactions}{" "}
                  transactions
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selectedTransactionId && (
        <TransactionDetailsDrawer
          transactionId={selectedTransactionId}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onUpdate={handleTransactionUpdate}
        />
      )}
    </div>
  );
}

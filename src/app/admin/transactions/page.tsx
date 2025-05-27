import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, ArrowUpDown, CheckCircle, XCircle } from "lucide-react";

export default function AdminTransactionsPage() {
  // In a real app, you would fetch transactions from the database
  const transactions = [
    {
      id: "1",
      amount: 1200,
      status: "COMPLETED",
      date: "2023-12-01",
      payerId: "user1",
      payerName: "John Doe",
      receiverId: "user2",
      receiverName: "Jane Smith",
      bookingId: "booking1",
      listingTitle: "Luxury Apartment in Downtown",
    },
    {
      id: "2",
      amount: 850,
      status: "PENDING",
      date: "2023-12-03",
      payerId: "user3",
      payerName: "Alice Johnson",
      receiverId: "user4",
      receiverName: "Bob Williams",
      bookingId: "booking2",
      listingTitle: "Cozy Cabin by the Lake",
    },
    {
      id: "3",
      amount: 1500,
      status: "COMPLETED",
      date: "2023-12-05",
      payerId: "user5",
      payerName: "Emma Brown",
      receiverId: "user6",
      receiverName: "Michael Davis",
      bookingId: "booking3",
      listingTitle: "Modern Loft in the City",
    },
    {
      id: "4",
      amount: 950,
      status: "FAILED",
      date: "2023-12-07",
      payerId: "user7",
      payerName: "Sarah Wilson",
      receiverId: "user8",
      receiverName: "James Taylor",
      bookingId: "booking4",
      listingTitle: "Beach House with Ocean View",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">
          Monitor and manage platform payments and transactions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,500</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">75% success rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of recent payments processed through the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">ID</th>
                  <th className="py-3 text-left font-medium">Date</th>
                  <th className="py-3 text-left font-medium">Amount</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Payer</th>
                  <th className="py-3 text-left font-medium">Receiver</th>
                  <th className="py-3 text-left font-medium">Listing</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="py-3">{transaction.id}</td>
                    <td className="py-3">{transaction.date}</td>
                    <td className="py-3">${transaction.amount}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          transaction.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3">{transaction.payerName}</td>
                    <td className="py-3">{transaction.receiverName}</td>
                    <td className="py-3 max-w-[200px] truncate">
                      {transaction.listingTitle}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

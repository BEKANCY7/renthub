"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  emailVerified: string | null;
  phoneVerified: boolean;
  verificationDocuments: string | null;
  createdAt: string;
}

export default function AdminVerificationsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // In a real app, this would be a proper API endpoint
      // For demo purposes, we'll simulate the API response
      const mockUsers: User[] = [
        {
          id: "user1",
          name: "John Doe",
          email: "john@example.com",
          role: "OWNER",
          isVerified: false,
          emailVerified: new Date().toISOString(),
          phoneVerified: true,
          verificationDocuments: JSON.stringify([
            "https://example.com/id.jpg",
            "https://example.com/address.jpg",
          ]),
          createdAt: new Date().toISOString(),
        },
        {
          id: "user2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "OWNER",
          isVerified: false,
          emailVerified: new Date().toISOString(),
          phoneVerified: true,
          verificationDocuments: JSON.stringify([
            "https://example.com/id2.jpg",
          ]),
          createdAt: new Date().toISOString(),
        },
        {
          id: "user3",
          name: "Bob Johnson",
          email: "bob@example.com",
          role: "OWNER",
          isVerified: true,
          emailVerified: new Date().toISOString(),
          phoneVerified: true,
          verificationDocuments: JSON.stringify([
            "https://example.com/id3.jpg",
          ]),
          createdAt: new Date().toISOString(),
        },
      ];

      // Filter users based on active tab
      let filteredUsers = mockUsers;

      if (activeTab === "pending") {
        filteredUsers = mockUsers.filter(
          (user) => user.verificationDocuments && !user.isVerified
        );
      } else if (activeTab === "verified") {
        filteredUsers = mockUsers.filter((user) => user.isVerified);
      } else if (activeTab === "rejected") {
        // In a real app, you would track rejected documents
        filteredUsers = [];
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
      }

      setUsers(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load verification requests");
      setLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    setIsApproving(true);
    try {
      const response = await fetch("/api/auth/verify-documents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          approved: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User verification approved successfully");
        setIsDialogOpen(false);
        fetchUsers(); // Refresh the list
      } else {
        toast.error(data.error || "Failed to approve verification");
      }
    } catch (error) {
      console.error("Error approving verification:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsRejecting(true);
    try {
      const response = await fetch("/api/auth/verify-documents", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          approved: false,
          rejectionReason,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("User verification rejected");
        setIsDialogOpen(false);
        setRejectionReason("");
        fetchUsers(); // Refresh the list
      } else {
        toast.error(data.error || "Failed to reject verification");
      }
    } catch (error) {
      console.error("Error rejecting verification:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsRejecting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            User Verifications
          </h1>
          <p className="text-muted-foreground">
            Review and manage user verification requests
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-fit">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Verification Requests</CardTitle>
              <CardDescription>
                Users who have submitted verification documents awaiting review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending verification requests found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email Status</TableHead>
                      <TableHead>Phone Status</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Submitted On</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "OWNER" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.emailVerified ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.phoneVerified ? (
                            <div className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Verified</span>
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              <span className="text-sm">Pending</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.verificationDocuments ? (
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="text-sm">
                                {JSON.parse(user.verificationDocuments).length}{" "}
                                document(s)
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              None
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verified" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Verified Users</CardTitle>
              <CardDescription>
                Users who have completed the verification process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No verified users found.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Email Status</TableHead>
                      <TableHead>Phone Status</TableHead>
                      <TableHead>Verified On</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "OWNER" ? "default" : "secondary"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Verified</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Verification Requests</CardTitle>
              <CardDescription>
                Users whose verification documents were rejected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No rejected verification requests found.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Verification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Review Verification</DialogTitle>
            <DialogDescription>
              Review the user's verification documents and information
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">User Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{selectedUser.name}</div>
                  <div className="text-muted-foreground">Email:</div>
                  <div>{selectedUser.email}</div>
                  <div className="text-muted-foreground">Role:</div>
                  <div>{selectedUser.role}</div>
                  <div className="text-muted-foreground">Email Verified:</div>
                  <div>{selectedUser.emailVerified ? "Yes" : "No"}</div>
                  <div className="text-muted-foreground">Phone Verified:</div>
                  <div>{selectedUser.phoneVerified ? "Yes" : "No"}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Verification Documents</h3>
                {selectedUser.verificationDocuments ? (
                  <div className="grid grid-cols-2 gap-2">
                    {JSON.parse(selectedUser.verificationDocuments).map(
                      (doc: string, index: number) => (
                        <div key={index} className="border rounded-md p-2">
                          <div className="flex items-center text-sm mb-1">
                            <FileText className="h-4 w-4 mr-1 text-blue-500" />
                            <span>Document {index + 1}</span>
                          </div>
                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs"
                            onClick={() => window.open(doc, "_blank")}
                          >
                            View Document
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No documents uploaded
                  </p>
                )}
              </div>

              {!selectedUser.isVerified && (
                <div className="space-y-2">
                  <h3 className="font-medium">Rejection Reason (Optional)</h3>
                  <Textarea
                    placeholder="Provide a reason if you're rejecting the verification"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>

            {selectedUser && !selectedUser.isVerified && (
              <>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isRejecting || isApproving}
                >
                  {isRejecting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Rejecting...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Approving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

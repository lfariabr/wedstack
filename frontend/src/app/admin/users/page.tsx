'use client';

import { useState } from "react";
import { 
  AlertCircle, 
  Loader2, 
  Shield, 
  ShieldAlert, 
  Trash2, 
  User as UserIcon
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useUsers, useUserMutations } from "@/lib/hooks/useUsers";
import { User, UserRole } from "@/lib/graphql/types/user.types";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

// Format date safely with fallback
const formatDateSafe = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return `${formatDistanceToNow(date)} ago`;
    }
    return 'recently';
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'recently';
  }
};

// When checking user roles
const isAdmin = (role: string) => role === 'ADMIN' || role === 'admin';
const isUser = (role: string) => role === 'USER' || role === 'user';

// Display roles with proper capitalization
const formatRole = (role: string) => {
  if (isAdmin(role)) return 'ADMIN';
  if (isUser(role)) return 'USER';
  if (role === 'EDITOR' || role === 'editor') return 'EDITOR';
  return role.toUpperCase(); // Fallback
};

// Convert role for API calls
const roleForApi = (role: string) => {
  if (isAdmin(role)) return 'ADMIN';
  if (isUser(role)) return 'USER';
  if (role === 'EDITOR' || role === 'editor') return 'EDITOR';
  return role.toUpperCase(); // Fallback
};

export default function UsersAdminPage() {
  const { users, loading, error } = useUsers();
  const { updateUserRole, deleteUser, loading: mutationLoading } = useUserMutations();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'role' | null>(null);
  const [targetRole, setTargetRole] = useState<UserRole | null>(null);
  
  // Handle role change
  const handleRoleChange = async (user: User, newRole: string) => {
    setSelectedUser(user);
    setTargetRole(roleForApi(newRole));
    setActionType('role');
  };
  
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setActionType('delete');
  };
  
  const confirmAction = async () => {
    if (!selectedUser) return;
    
    if (actionType === 'role' && targetRole) {
      await updateUserRole(selectedUser.id, targetRole);
    } else if (actionType === 'delete') {
      await deleteUser(selectedUser.id);
    }
    
    // Reset state
    setSelectedUser(null);
    setActionType(null);
    setTargetRole(null);
  };
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage registered users and their access roles.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading users: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && users.length === 0 && (
        <div className="text-center py-20">
          <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">
            There are no registered users in the system yet.
          </p>
        </div>
      )}

      {/* Users table */}
      {!loading && !error && users.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {isAdmin(user.role) ? (
                      <Badge className="bg-purple-600">
                        <ShieldAlert className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <UserIcon className="h-3 w-3 mr-1" />
                        User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.createdAt && formatDateSafe(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {isUser(user.role) ? (
                          <DropdownMenuItem onClick={() => handleRoleChange(user, 'ADMIN')}>
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleRoleChange(user, 'USER')}>
                            <UserIcon className="h-4 w-4 mr-2" />
                            Make Regular User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedUser && !!actionType} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'delete' 
                ? 'Delete User' 
                : actionType === 'role' && isAdmin(targetRole)
                  ? 'Promote to Admin'
                  : 'Demote to Regular User'
              }
            </DialogTitle>
            <DialogDescription>
              {actionType === 'delete' 
                ? 'This action cannot be undone. The user account will be permanently deleted.'
                : actionType === 'role' && isAdmin(targetRole)
                  ? 'This will give the user administrative privileges.'
                  : 'This will remove administrative privileges from this user.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <div className="bg-secondary text-secondary-foreground rounded-full h-12 w-12 flex items-center justify-center">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant={actionType === 'delete' ? 'destructive' : 'default'}
              onClick={confirmAction}
              disabled={mutationLoading.any}
            >
              {mutationLoading.any && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionType === 'delete' 
                ? 'Delete' 
                : actionType === 'role' && isAdmin(targetRole)
                  ? 'Promote'
                  : 'Demote'
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminHeader from '../../../../components/common/AdminHeader';
import { getAllUsers, type AdminUser as ApiUser } from '../../../../services/user';
import UserForm from '../../../../components/Form/UserForm';

type Role = 'Admin' | 'Customer';

type UserFormData = {
  avatar?: string;
  fullName: string;
  phone: string;
  email: string;
  role: Role;
};

type User = {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  orders: number;
  totalSpent: number;
  joined: string;
};

const getInitials = (name: string) => name.split(' ').filter(Boolean).map((part) => part[0]?.toUpperCase()).slice(0, 2).join('');

const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const { data: usersData, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const users = useMemo<User[]>(() => {
    if (!usersData?.success || !usersData.data) return [];

    return usersData.data.map((user: ApiUser, index) => {
      const isExplicitAdmin = user.name?.trim().toLowerCase() === 'admin' || user.email?.toLowerCase() === '24520059@gm.uit.edu.vn';
      const role = isExplicitAdmin || (user as any).role?.toLowerCase() === 'admin' ? 'Admin' : 'Customer';
      const joined = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : '—';

      return {
        id: String((user as any).id ?? user.email ?? index),
        avatar: user.avatar,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role,
        orders: Number(user.totalOrders ?? 0),
        totalSpent: Number(user.totalSpent ?? 0),
        joined,
      };
    });
  }, [usersData]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      const haystack = `${user.name} ${user.email} ${user.phone} ${user.role}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [users, searchTerm]);

  const totalUsers = filteredUsers.length;
  const usersPerPage = 10;
  const totalPages = Math.ceil(totalUsers / usersPerPage) || 1;
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const getPaginationPages = () => {
    const pages: (number | string)[] = [];
    const maxDotsPages = 3;
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > maxDotsPages + 1) pages.push('...');
      for (let i = Math.max(2, currentPage - maxDotsPages); i <= Math.min(totalPages - 1, currentPage + maxDotsPages); i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - maxDotsPages) pages.push('...');
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      <AdminHeader title="Users" subtitle="Manage accounts" />
      <section className="px-9 py-11">
        <div className="flex flex-wrap items-center gap-6 justify-between">
          <div className="flex-1 min-w-[320px] max-w-3xl">
            <label className="flex items-center gap-3 bg-white border border-neutral-300 rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <svg aria-hidden="true" className="h-6 w-6 text-neutral-600" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="6.5" />
                <path strokeLinecap="round" d="M16 16l4.5 4.5" />
              </svg>
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search ${filteredUsers.length} users`}
                className="flex-1 bg-transparent outline-none text-neutral-800 placeholder:text-neutral-500 text-base"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="text-neutral-500 cursor-pointer hover:text-neutral-800 transition"
                  aria-label="Clear search"
                >
                  <svg aria-hidden="true" width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4.25">
                    <path d="M15.0032 1.0166L1.0166 14.5829M1.0166 1.0166L15.0032 14.5829" stroke="#1A202C" strokeWidth="2.03324" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </label>
          </div>
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-neutral-500 text-lg font-semibold border-b border-neutral-200">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Orders</th>
                  <th className="py-4 px-6 text-right">Total Spent</th>
                  <th className="py-4 px-6">Joined</th>
                </tr>
              </thead>
              <tbody className="text-neutral-900 text-base">
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="py-6 px-6 text-center text-neutral-500">Loading users...</td>
                  </tr>
                )}

                {isError && !isLoading && (
                  <tr>
                    <td colSpan={6} className="py-6 px-6 text-center text-red-600">Failed to load users</td>
                  </tr>
                )}

                {!isLoading && !isError && paginatedUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 px-6 text-center text-neutral-500">No users found</td>
                  </tr>
                )}

                {!isLoading && !isError && paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-neutral-200 last:border-b-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-neutral-200 bg-neutral-50" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-200 text-neutral-700 flex items-center justify-center font-semibold">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-neutral-900">{user.name}</span>
                          <span className="text-neutral-500 text-sm">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-800">{user.phone}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'Admin' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-200 text-neutral-700'}`}>{user.role.toLowerCase()}</span>
                    </td>
                    <td className="py-4 px-6 text-neutral-800">{user.orders}</td>
                    <td className="py-4 px-6 font-semibold text-neutral-900 text-right whitespace-nowrap">{user.totalSpent.toLocaleString()}₫</td>
                    <td className="py-4 px-6 text-neutral-700">{user.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-neutral-700 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Previous
          </button>

          <div className="flex gap-2 mx-2">
            {getPaginationPages().map((page) => (
              <button
                key={page}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={`
                  px-3 py-2 rounded-lg font-medium transition-all
                  ${page === currentPage
                    ? 'bg-[#396254] text-white cursor-pointer'
                    : page === '...'
                      ? 'text-neutral-500 cursor-not-allowed'
                      : 'text-neutral-700 hover:bg-neutral-100 cursor-pointer'
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-neutral-700 hover:text-neutral-900 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors font-medium cursor-pointer"
          >
            Next
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </section>

      {showUserForm && (
        <UserForm
          mode={editingUser ? 'edit' : 'create'}
          title={editingUser ? 'Edit User' : 'Add New User'}
          description={editingUser ? 'Update user information' : 'Create a new user'}
          initialValues={editingUser ? {
            avatar: editingUser.avatar,
            fullName: editingUser.name,
            phone: editingUser.phone,
            email: editingUser.email,
            role: editingUser.role,
          } : undefined}
          onCancel={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
          onSubmit={(data: UserFormData) => {
            setShowUserForm(false);
            setEditingUser(null);
          }}
        />
      )}

      {deleteUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 relative">
            <button
              type="button"
              onClick={() => setDeleteUser(null)}
              className="absolute top-6 right-6 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="p-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-4">Delete User?</h2>
              <p className="text-neutral-700 text-base mb-8">
                Are you sure you want to delete user <span className="font-bold">"{deleteUser.name}"</span>? This action can't be undone
              </p>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteUser(null)}
                  className="px-6 py-3 border-2 border-neutral-800 text-neutral-800 font-semibold rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteUser(null)}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUser;
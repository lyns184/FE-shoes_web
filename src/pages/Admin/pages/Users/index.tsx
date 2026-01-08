import { useMemo, useState } from 'react';
import AdminHeader from '../../../../components/common/AdminHeader';
import UserForm, { type UserFormData } from '../../../../components/Form/UserForm';

type Role = 'Admin' | 'Customer';

type User = {
  id: number;
  avatar?: string; // optional avatar URL
  name: string;
  email: string;
  phone: string;
  role: Role;
  orders: number;
  totalSpent: number; // USD amount
  joined: string; // YYYY-MM-DD
};

const AdminUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [deleteUser, setDeleteUser] = useState<{ id: number; name: string } | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const users = useMemo<User[]>(() => ([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', role: 'Customer', orders: 12, totalSpent: 3450, joined: '2023-06-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', role: 'Customer', orders: 8, totalSpent: 2120, joined: '2023-08-22' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', role: 'Admin', orders: 0, totalSpent: 0, joined: '2023-01-10' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', role: 'Customer', orders: 25, totalSpent: 8750, joined: '2023-03-05' },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 6, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 7, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 8, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 9, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 10, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 11, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 891', role: 'Customer', orders: 8, totalSpent: 2120, joined: '2023-08-22' },
    { id: 12, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 234 567 892', role: 'Customer', orders: 0, totalSpent: 0, joined: '2023-01-10' },
    { id: 13, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234 567 893', role: 'Customer', orders: 25, totalSpent: 8750, joined: '2023-03-05' },
    { id: 14, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 15, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 16, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 17, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 18, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 19, name: 'Charlie Davis', email: 'charlie@example.com', phone: '+1 234 567 894', role: 'Customer', orders: 3, totalSpent: 875, joined: '2024-01-02' },
    { id: 20, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 890', role: 'Customer', orders: 12, totalSpent: 3450, joined: '2023-06-15' },
  ]), []);

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] ?? '';
    const last = parts[parts.length - 1]?.[0] ?? '';
    return (first + last).toUpperCase();
  };

  // Filter by search term
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const list = term
      ? users.filter(u =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.phone.toLowerCase().includes(term) ||
          u.role.toLowerCase().includes(term)
        )
      : users;

    // Sort Admins first
    return [...list].sort((a, b) => {
      if (a.role === 'Admin' && b.role !== 'Admin') return -1;
      if (b.role === 'Admin' && a.role !== 'Admin') return 1;
      return 0;
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

          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                setEditingUser(null);
                setShowUserForm(true);
              }}
              className="bg-[#396254] hover:bg-[#2f4f45] text-white text-lg font-semibold px-6 py-4 rounded-2xl shadow-sm transition-colors duration-150 flex items-center gap-3 cursor-pointer"
            >
              <span>+ Add User</span>
            </button>
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
                  <th className="py-4 px-6">Total Spent</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody className="text-neutral-900 text-base">
                {paginatedUsers.map((user) => (
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
                    <td className="py-4 px-6 font-semibold text-neutral-900">${user.totalSpent.toLocaleString()}</td>
                    <td className="py-4 px-6 text-neutral-700">{user.joined}</td>
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                          className="hover:bg-neutral-100 p-2 rounded-lg transition-colors cursor-pointer"
                          aria-label="More options"
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.69989 7.25781C7.00822 7.25781 7.25818 7.00786 7.25818 6.69952C7.25818 6.39119 7.00822 6.14124 6.69989 6.14124C6.39156 6.14124 6.1416 6.39119 6.1416 6.69952C6.1416 7.00786 6.39156 7.25781 6.69989 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10.6091 7.25781C10.9174 7.25781 11.1674 7.00786 11.1674 6.69952C11.1674 6.39119 10.9174 6.14124 10.6091 6.14124C10.3007 6.14124 10.0508 6.39119 10.0508 6.69952C10.0508 7.00786 10.3007 7.25781 10.6091 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2.79266 7.25781C3.101 7.25781 3.35095 7.00786 3.35095 6.69952C3.35095 6.39119 3.101 6.14124 2.79266 6.14124C2.48433 6.14124 2.23438 6.39119 2.23438 6.69952C2.23438 7.00786 2.48433 7.25781 2.79266 7.25781Z" stroke="#1D3029" strokeWidth="1.11657" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>

                        {openMenu === user.id && (
                          <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl border border-neutral-200 shadow-lg z-50 min-w-40 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null);
                                setEditingUser(user);
                                setShowUserForm(true);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-neutral-800 hover:bg-neutral-50 transition-colors font-medium text-left cursor-pointer"
                            >
                              <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.25 3.37132H3.25C2.71957 3.37132 2.21086 3.58203 1.83579 3.95711C1.46071 4.33218 1.25 4.84089 1.25 5.37132V19.3713C1.25 19.9018 1.46071 20.4105 1.83579 20.7855C2.21086 21.1606 2.71957 21.3713 3.25 21.3713H17.25C17.7804 21.3713 18.2891 21.1606 18.6642 20.7855C19.0393 20.4105 19.25 19.9018 19.25 19.3713V12.3713M17.75 1.87132C18.1478 1.4735 18.6874 1.25 19.25 1.25C19.8126 1.25 20.3522 1.4735 20.75 1.87132C21.1478 2.26915 21.3713 2.80871 21.3713 3.37132C21.3713 3.93393 21.1478 4.4735 20.75 4.87132L11.25 14.3713L7.25 15.3713L8.25 11.3713L17.75 1.87132Z" stroke="#1E1E1E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null);
                                setDeleteUser({ id: user.id, name: user.name });
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-left cursor-pointer border-t border-neutral-200"
                            >
                              <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.25 5.25H3.25M3.25 5.25H19.25M3.25 5.25V19.25C3.25 19.7804 3.46071 20.2891 3.83579 20.6642C4.21086 21.0393 4.71957 21.25 5.25 21.25H15.25C15.7804 21.25 16.2891 21.0393 16.6642 20.6642C17.0393 20.2891 17.25 19.7804 17.25 19.25V5.25M6.25 5.25V3.25C6.25 2.71957 6.46071 2.21086 6.83579 1.83579C7.21086 1.46071 7.71957 1.25 8.25 1.25H12.25C12.7804 1.25 13.2891 1.46071 13.6642 1.83579C14.0393 2.21086 14.25 2.71957 14.25 3.25V5.25M8.25 10.25V16.25M12.25 10.25V16.25" stroke="#EC221F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
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
            console.log('User form submitted:', data);
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
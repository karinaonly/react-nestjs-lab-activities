import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Nav from '../components/Nav';
import ConfirmDialog from '../components/ConfirmDialog';
import { getAllUsers, getUserStats, createUser, deleteUser, updateUser } from '../service/usersService';

const UserManagementPage = () => {
  const navigate = useNavigate();
  const { isAdmin, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role: 'user',
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/movies');
      return;
    }
    fetchUsers();
    fetchStats();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getUserStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user (remove password if not changed)
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateUser(editingUser.id, updateData);
      } else {
        // Create new user
        await createUser(formData);
      }
      
      setShowModal(false);
      resetForm();
      fetchUsers();
      fetchStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDelete = async (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete);
      fetchUsers();
      fetchStats();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Failed to delete user');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: '',
      username: user.username || '',
      role: user.role,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      role: 'user',
    });
    setEditingUser(null);
    setError('');
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
        <Nav />
        <div className="flex justify-center items-center h-96">
          <div className="text-xl" style={{ color: 'var(--text-primary)' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <Nav
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>User Management</h1>
          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-md border text-sm"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="user">Users</option>
            </select>
            <button
              onClick={openCreateModal}
              className="text-white px-6 py-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--accent-color)' }}
            >
              Add New User
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--bg-card)' }}>
              <h3 className="text-sm" style={{ color: 'var(--text-muted)' }}>Total Users</h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.total}</p>
            </div>
            <div className="p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--bg-card)' }}>
              <h3 className="text-sm" style={{ color: 'var(--text-muted)' }}>Admins</h3>
              <p className="text-3xl font-bold" style={{ color: 'var(--accent-color)' }}>{stats.admins}</p>
            </div>
            <div className="p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--bg-card)' }}>
              <h3 className="text-sm" style={{ color: 'var(--text-muted)' }}>Regular Users</h3>
              <p className="text-3xl font-bold text-green-600">{stats.users}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
          <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-color)' }}>
            <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Created At
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              {users
                .filter((u) => {
                  const matchesSearch = searchTerm.trim()
                    ? (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                      (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()))
                    : true;
                  const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter;
                  return matchesSearch && matchesRole;
                })
                .map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-primary)' }}>
                    {user.username || '-'}
                    {currentUser?.id === user.id && (
                      <span className="ml-2 text-xs font-semibold" style={{ color: 'var(--accent-color)' }}>(You)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: 'var(--text-muted)' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="mr-4 hover:underline"
                      style={{ color: 'var(--accent-color)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={currentUser?.id === user.id}
                      className={`hover:underline ${
                        currentUser?.id === user.id 
                          ? 'text-gray-400 cursor-not-allowed' 
                          : 'text-red-600 hover:text-red-900'
                      }`}
                      title={currentUser?.id === user.id ? 'Cannot delete your own account' : ''}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 overflow-y-auto h-full w-full z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="mt-3">
                <h3 className="text-lg font-medium leading-6 mb-4" style={{ color: 'var(--text-primary)' }}>
                  {editingUser ? 'Edit User' : 'Create New User'}
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Password {editingUser && '(leave blank to keep current)'}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                      required={!editingUser}
                      minLength={6}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderColor: 'var(--border-color)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <option value="user">User (Rater)</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="px-4 py-2 rounded-md transition-colors"
                      style={{ 
                        backgroundColor: 'var(--bg-secondary)', 
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white rounded-md transition-colors"
                      style={{ backgroundColor: 'var(--accent-color)' }}
                    >
                      {editingUser ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </div>
  );
};

export default UserManagementPage;

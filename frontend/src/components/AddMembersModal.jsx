import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Loader2 } from 'lucide-react';
import { getAllUsers, addMember } from '../api/axios';
import toast from 'react-hot-toast';

export default function AddMembersModal({ project, onClose, onMemberAdded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [adding, setAdding] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const isMember = (userId) => {
    return project.members?.some(m => m._id === userId) || project.owner?._id === userId;
  };

  const handleAddMember = async (userId) => {
    try {
      setAdding({ ...adding, [userId]: true });
      await addMember(project._id, userId);
      toast.success('Member added successfully!');
      onMemberAdded();
      setAdding({ ...adding, [userId]: false });
    } catch (error) {
      console.error('Error adding member:', error);
      setAdding({ ...adding, [userId]: false });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Add Members</h2>
            <p className="text-sm text-gray-600 mt-1">Add team members to "{project.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const isAlreadyMember = isMember(user._id);
                const isAdding = adding[user._id];

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>

                    {isAlreadyMember ? (
                      <span className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium">
                        {project.owner?._id === user._id ? 'Owner' : 'Member'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddMember(user._id)}
                        disabled={isAdding}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                      >
                        {isAdding ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          <UserPlus size={16} />
                        )}
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
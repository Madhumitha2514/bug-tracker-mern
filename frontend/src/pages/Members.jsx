import { useState, useEffect } from 'react';
import { getAllUsers } from '../api/axios';
import { Users, Mail, Calendar } from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setMembers(response.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching members:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading members...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Team Members</h1>
        <p className="text-gray-600">All registered users in the system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-800">{members.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member._id}
            className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition"
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  {member.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {member.name}
                </h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                  <Mail size={14} />
                  <span className="truncate">{member.email}</span>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No members found</p>
        </div>
      )}
    </div>
  );
}
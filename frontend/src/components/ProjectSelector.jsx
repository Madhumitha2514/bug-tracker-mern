import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Folder } from 'lucide-react';

export default function ProjectSelector({ projects, currentProjectId, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentProject = projects.find(p => p._id === currentProjectId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (projectId) => {
    onChange(projectId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <Folder size={18} />
        <span className="font-medium">
          {currentProject?.title || 'Select Project'}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50 max-h-80 overflow-y-auto">
          {projects.map((project) => (
            <button
              key={project._id}
              onClick={() => handleSelect(project._id)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-100 transition first:rounded-t-lg last:rounded-b-lg flex items-center gap-3 ${
                project._id === currentProjectId ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <Folder size={16} />
              <div className="flex-1">
                <p className="font-medium">{project.title}</p>
                {project.description && (
                  <p className="text-xs text-gray-500 truncate">{project.description}</p>
                )}
              </div>
              {project._id === currentProjectId && (
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
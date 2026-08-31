import { NavLink, useNavigate } from 'react-router-dom';
import { IoHome, IoVideocam, IoPeople, IoCalendar, IoStorefront, IoPerson, IoClose } from 'react-icons/io5';
import Logo from '../ui/Logo.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { icon: IoHome, label: 'Feed', path: '/feed' },
    { icon: IoVideocam, label: 'Reels', path: '/reels' },
    { icon: IoPeople, label: 'Groups', path: '/groups' },
    { icon: IoCalendar, label: 'Events', path: '/events' },
    { icon: IoStorefront, label: 'Marketplace', path: '/marketplace' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-14 bottom-0 left-0 w-64 z-50
          bg-bg-secondary border-r border-border-color
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:shrink-0
        `}
      >
        <div className="p-4 border-b border-border-color flex items-center justify-between">
          <Logo size="sm" showText={false} />
          <button onClick={onClose} className="lg:hidden text-text-secondary">
            <IoClose size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary hover:bg-bg-tertiary'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <button
            onClick={() => navigate(`/profile/${user?.id}`)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-text-secondary hover:bg-bg-tertiary"
          >
            <IoPerson size={20} />
            <span>Profile</span>
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
import { useNavigate } from 'react-router-dom';
import { IoMenu, IoSearch, IoNotifications, IoMoon, IoSunny } from 'react-icons/io5';
import Logo from '../ui/Logo.jsx';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-bg-primary border-b border-border-color h-14">
      <div className="flex items-center justify-between px-3 sm:px-4 h-full">
        <div className="flex items-center gap-2">
          <button onClick={onMenuClick} className="lg:hidden text-text-secondary p-1">
            <IoMenu size={24} />
          </button>
          <Logo size="sm" showText={false} />
        </div>

        <button
          onClick={() => navigate('/search')}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary text-text-muted w-64"
        >
          <IoSearch size={18} />
          <span className="text-sm">Search...</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/search')}
            className="md:hidden p-2 rounded-lg hover:bg-bg-secondary text-text-secondary"
          >
            <IoSearch size={20} />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary"
          >
            {isDark ? <IoSunny size={20} /> : <IoMoon size={20} />}
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="p-2 rounded-lg hover:bg-bg-secondary text-text-secondary relative"
          >
            <IoNotifications size={20} />
            <span className="absolute top-1 right-1">
              <Badge count={0} />
            </span>
          </button>

          <div className="rounded-full border-2 border-border-color">
            <Avatar
              src={user?.avatarUrl}
              name={user?.fullName}
              size="sm"
              onClick={() => navigate(`/profile/${user?.id}`)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import { NavLink } from 'react-router-dom';
import { IoHome, IoVideocam, IoChatbubbles, IoPeople, IoStorefront } from 'react-icons/io5';

const MobileNav = () => {
  const items = [
    { icon: IoHome, label: 'Home', path: '/feed' },
    { icon: IoVideocam, label: 'Reels', path: '/reels' },
    { icon: IoChatbubbles, label: 'Chats', path: '/messages' },
    { icon: IoPeople, label: 'Groups', path: '/groups' },
    { icon: IoStorefront, label: 'Market', path: '/marketplace' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border-color z-40 pb-safe">
      <div className="flex justify-around py-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 p-2 rounded-lg
              ${isActive ? 'text-text-primary' : 'text-text-muted'}
            `}
          >
            <item.icon size={22} />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
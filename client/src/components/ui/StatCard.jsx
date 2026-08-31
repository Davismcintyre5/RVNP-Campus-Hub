const StatCard = ({ label, value, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-bg-secondary transition-all"
    >
      <span className="text-lg font-heading font-bold text-text-primary">
        {value}
      </span>
      <span className="text-xs text-text-muted">
        {label}
      </span>
    </button>
  );
};

export default StatCard;
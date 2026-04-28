import { Link } from 'react-router-dom';
import './EmptyState.css';

export default function EmptyState({ icon = '😕', title, subtitle, actionLabel, actionTo }) {
  return (
    <div className="empty-state-box">
      <span className="empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      {subtitle && <p className="empty-state-sub">{subtitle}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="empty-state-btn">{actionLabel}</Link>
      )}
    </div>
  );
}

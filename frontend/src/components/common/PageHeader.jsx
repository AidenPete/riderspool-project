import { Link } from 'react-router-dom';
import './PageHeader.css';

function PageHeader({ title, subtitle, breadcrumbs = [] }) {
  return (
    <div className="page-header">
      {breadcrumbs.length > 0 && (
        <div className="breadcrumb">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {crumb.path ? (
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </span>
          ))}
        </div>
      )}
      <h1>{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </div>
  );
}

export default PageHeader;

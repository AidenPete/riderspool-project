import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './NotFound.css';

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon">404</div>
        <h1>Page Not Found</h1>
        <p>Sorry, the page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <Link to="/">
            <Button variant="primary">Go to Homepage</Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

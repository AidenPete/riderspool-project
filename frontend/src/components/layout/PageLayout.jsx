import Navbar from './Navbar';
import './PageLayout.css';

function PageLayout({ children, maxWidth = '1280px' }) {
  return (
    <div className="page-layout">
      <Navbar />
      <div className="page-content" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;

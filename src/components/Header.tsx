import LoginButton from '@/components/LoginButton';
import { Link } from '@tanstack/react-router';
import Logo from '../assets/drift_watch-logo.svg';
import styles from './Header.module.scss';
import { FaGithub, FaExclamationCircle } from 'react-icons/fa';
import { SiReadthedocs } from 'react-icons/si';
import { DOCS_URL, GITHUB_URL } from '@/lib/env';

const issuesUrl = `${GITHUB_URL}/issues`;

const Header = () => {
  return (
    <header className={styles.app_header}>
      <div className={styles.home_link}>
        <Link to="/" className={styles.home_button} activeOptions={{ exact: true }}>
          <img
            className={styles.logo}
            src={Logo}
            alt="Drift Watch Logo"
            style={{ height: '50px' }}
          />
          Experiments
        </Link>
      </div>
      <div className={styles.nav_links}>
        <Link to={DOCS_URL} className={styles.nav_link} activeOptions={{ exact: true }}>
          <SiReadthedocs className={styles.icon} />
          <span className={styles.linkText}>Documentation</span>
        </Link>
        <Link to={GITHUB_URL} className={styles.nav_link} activeOptions={{ exact: true }}>
          <FaGithub className={styles.icon} />
          <span className={styles.linkText}>GitHub</span>
        </Link>
        <Link to={issuesUrl} className={styles.nav_link} activeOptions={{ exact: true }}>
          <FaExclamationCircle className={styles.icon} />
          <span className={styles.linkText}>Issues</span>
        </Link>
      </div>
      <div className={styles.login}>
        <LoginButton />
      </div>
    </header>
  );
};

export default Header;

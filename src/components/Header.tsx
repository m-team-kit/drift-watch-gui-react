import LoginButton from '@/components/LoginButton';
import { Link } from '@tanstack/react-router';
import Logo from '../assets/drift_watch-logo.svg';
import styles from './Header.module.scss';

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
      <div className={styles.login}>
        <LoginButton />
      </div>
    </header>
  );
};

export default Header;

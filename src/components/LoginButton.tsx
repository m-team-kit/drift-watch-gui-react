import { useAuth } from '@/components/AuthContext';
import { useUser } from '@/components/UserContext';

const LoginButton = () => {
  const auth = useAuth();
  const user = useUser();

  if (auth.status !== 'logged-in') {
    return (
      <button className="navbar-button" onClick={() => auth.login()}>
        Login
      </button>
    );
  }

  const name =
    (user.status === 'ok' ? user.email : undefined) ??
    auth.user.name ??
    auth.user.preferred_username ??
    auth.user.email ??
    'unknown';

  return (
    <button className="navbar-button" onClick={() => auth.logout()}>
      {user.status === 'error' ? user.message : user.status === 'loading' ? 'Loading...' : name}{' '}
      (Logout)
    </button>
  );
};

export default LoginButton;

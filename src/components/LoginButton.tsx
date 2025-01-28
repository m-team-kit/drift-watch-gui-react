import { useAuth } from '@/components/auth';

const LoginButton = () => {
  const auth = useAuth();

  if (auth.state.status !== 'logged-in') {
    return (
      <button className="navbar-button" onClick={() => auth.login()}>
        Login
      </button>
    );
  }

  return (
    <button className="navbar-button" onClick={() => auth.logout()}>
      {auth.state.user.name ??
        auth.state.user.preferred_username ??
        auth.state.user.email ??
        'unknown'}{' '}
      (Logout)
    </button>
  );
};

export default LoginButton;

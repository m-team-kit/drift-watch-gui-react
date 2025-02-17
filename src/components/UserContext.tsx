import userPost from '@/api/functions/userPost';
import userSelfGet from '@/api/functions/userSelfGet';
import userSelfPut from '@/api/functions/userSelfPut';
import { type User } from '@/api/models/index';
import { useAuth } from '@/components/AuthContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

type UserContext =
  | ({ status: 'ok' } & User)
  | { status: 'error'; message: string }
  | { status: 'loading' };
const UserContext = createContext<UserContext | undefined>(undefined);

export const useUser = () => {
  const user = useContext(UserContext);
  if (user === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return user;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuth();
  const [updated, setUpdated] = useState(false);
  const user = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      userSelfGet({
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      }),
    enabled: updated && auth.status === 'logged-in',
  });

  const updateUser = useMutation({
    mutationFn: async () => {
      const response = await userSelfPut({
        config: {
          basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
          auth: {
            bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
          },
        },
      });
      if (response.status === 403) {
        const registerResponse = await userPost({
          config: {
            basePath: 'https://drift-watch.dev.ai4eosc.eu/api/latest',
            auth: {
              bearer: auth.status === 'logged-in' ? auth.auth.token : undefined,
            },
          },
        });
        if (registerResponse.status === 201) {
          setUpdated(true);
        } else {
          throw new Error(`Failed to register user: ${registerResponse.status}`);
        }
      }
      if (response.status === 200) {
        setUpdated(true);
      } else {
        throw new Error(`Failed to update user: ${response.status}`);
      }
    },
  });

  useEffect(() => {
    if (auth.status === 'logged-in' && !updated) {
      updateUser.mutate();
    }
  }, [auth.status, updated]);

  return (
    <UserContext.Provider
      value={
        updateUser.isError
          ? { status: 'error', message: 'Failed to update user' }
          : user.data?.status === 200
            ? {
                status: 'ok',
                ...user.data.data,
              }
            : { status: 'loading' }
      }
    >
      {children}
    </UserContext.Provider>
  );
};

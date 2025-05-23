import { type ConfigOverrides } from '../clientConfig.js';

import { type ResponseDEFAULTERROR } from '../responses/DEFAULT_ERROR.js';
import type UserSelfPutResponse from './userSelfPut.responses.js';
import { type Response200, type Response401, type Response403 } from './userSelfPut.responses.js';

/**
 * Updates the user information based on the provided auth token.
 *
 * autogenerated
 *
 * @async
 **/
const userSelfPut = async (
  parameters: { config?: ConfigOverrides } = {},
): Promise<UserSelfPutResponse> => {
  const { config } = parameters;
  const url = `${config?.basePath ?? ''}/user/self`;
  const localFetch = config?.fetch ?? fetch;
  const headers = new Headers(config?.defaultParams?.headers);

  if (config?.auth?.bearer != null) {
    headers.set('authorization', `Bearer ${config.auth.bearer}`);
  }

  const method = 'PUT';
  const requestMeta = {
    url,
    method,
  };

  const response = await localFetch(url, {
    ...config?.defaultParams,
    method,
    headers,
  });

  switch (response.status) {
    case 200:
      return {
        status: 200,
        data: (await response.json()) as Response200,
        response,
        request: requestMeta,
      };
    case 401:
      return {
        status: 401,
        data: (await response.json()) as Response401,
        response,
        request: requestMeta,
      };
    case 403:
      return {
        status: 403,
        data: (await response.json()) as Response403,
        response,
        request: requestMeta,
      };
    default:
      if (response.status !== 0) {
        return {
          status: 'default',
          data: (await response.json()) as ResponseDEFAULTERROR,
          response,
          request: requestMeta,
        };
      }
      return {
        status: -1,
        response,
        request: requestMeta,
      };
  }
};

export default userSelfPut;

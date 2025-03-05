import { type ConfigOverrides } from '../clientConfig.js';

import type ExperimentIdDriftIdDeleteParams from './experimentIdDriftIdDelete.parameters.js';

import { type ResponseDEFAULTERROR } from '../responses/DEFAULT_ERROR.js';
import type ExperimentIdDriftIdDeleteResponse from './experimentIdDriftIdDelete.responses.js';
import {
  type Response401,
  type Response403,
  type Response404,
} from './experimentIdDriftIdDelete.responses.js';

/**
 * Delete a drift job record from the database.
 *
 * autogenerated
 *
 * @async
 **/
const experimentIdDriftIdDelete = async (
  parameters: ExperimentIdDriftIdDeleteParams & { config?: ConfigOverrides },
): Promise<ExperimentIdDriftIdDeleteResponse> => {
  const {
    params: { experiment_id, drift_id },
    config,
  } = parameters;
  const url = `${config?.basePath ?? ''}/experiment/${encodeURIComponent(experiment_id.toString())}/drift/${encodeURIComponent(drift_id.toString())}`;
  const localFetch = config?.fetch ?? fetch;
  const headers = new Headers(config?.defaultParams?.headers);

  if (config?.auth?.bearer != null) {
    headers.set('authorization', `Bearer ${config.auth.bearer}`);
  }

  const method = 'DELETE';
  const requestMeta = {
    url,
    method,
    parameters,
  };

  const response = await localFetch(url, {
    ...config?.defaultParams,
    method,
    headers,
  });

  switch (response.status) {
    case 204:
      return {
        status: 204,
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
    case 404:
      return {
        status: 404,
        data: (await response.json()) as Response404,
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

export default experimentIdDriftIdDelete;

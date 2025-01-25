import { type ApiFunction } from '../apiFunction.js';

import type ExperimentIdDriftIdGetParams from './experimentIdDriftIdGet.parameters.js';

import { type ResponseDEFAULT_ERROR } from '../responses/DEFAULT_ERROR.js';
import type ExperimentIdDriftIdGetResponse from './experimentIdDriftIdGet.responses.js';
import { type Response200, type Response404 } from './experimentIdDriftIdGet.responses.js';

/**
 * Retrieve a drift job by its id from the database.
 *
 * autogenerated
 *
 * @async
 **/
const experimentIdDriftIdGet: ApiFunction<
  ExperimentIdDriftIdGetParams,
  ExperimentIdDriftIdGetResponse
> = async (parameters) => {
  const {
    params: { experiment_id, drift_id },
    config,
  } = parameters;
  const url = `${config?.basePath ?? ''}/experiment/${experiment_id.toString()}/drift/${drift_id.toString()}`;
  const localFetch = config?.fetch ?? fetch;
  const headers = new Headers(config?.defaultParams?.headers);

  if (config?.auth?.bearer != null) {
    headers.set('authorization', `Bearer ${config.auth.bearer}`);
  }

  const method = 'GET';
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
    case 200:
      return {
        status: 200,
        data: (await response.json()) as Response200,
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
          data: (await response.json()) as ResponseDEFAULT_ERROR,
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

export default experimentIdDriftIdGet;

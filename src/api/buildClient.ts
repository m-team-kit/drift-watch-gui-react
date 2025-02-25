import { mergeConfigs, type GlobalConfig } from './clientConfig.js';
import entitlementGet from './functions/entitlementGet.js';
import experimentIdDelete from './functions/experimentIdDelete.js';
import experimentIdDriftIdDelete from './functions/experimentIdDriftIdDelete.js';
import experimentIdDriftIdGet from './functions/experimentIdDriftIdGet.js';
import experimentIdDriftIdPut from './functions/experimentIdDriftIdPut.js';
import experimentIdDriftPost from './functions/experimentIdDriftPost.js';
import experimentIdDriftSearchPost from './functions/experimentIdDriftSearchPost.js';
import experimentIdGet from './functions/experimentIdGet.js';
import experimentIdPut from './functions/experimentIdPut.js';
import experimentPost from './functions/experimentPost.js';
import experimentSearchPost from './functions/experimentSearchPost.js';
import userPost from './functions/userPost.js';
import userSearchPost from './functions/userSearchPost.js';
import userSelfGet from './functions/userSelfGet.js';
import userSelfPut from './functions/userSelfPut.js';

const buildClient = (
  baseConfig?: GlobalConfig,
): {
  entitlementGet: typeof entitlementGet;
  experimentIdDelete: typeof experimentIdDelete;
  experimentIdDriftIdDelete: typeof experimentIdDriftIdDelete;
  experimentIdDriftIdGet: typeof experimentIdDriftIdGet;
  experimentIdDriftIdPut: typeof experimentIdDriftIdPut;
  experimentIdDriftPost: typeof experimentIdDriftPost;
  experimentIdDriftSearchPost: typeof experimentIdDriftSearchPost;
  experimentIdGet: typeof experimentIdGet;
  experimentIdPut: typeof experimentIdPut;
  experimentPost: typeof experimentPost;
  experimentSearchPost: typeof experimentSearchPost;
  userPost: typeof userPost;
  userSearchPost: typeof userSearchPost;
  userSelfGet: typeof userSelfGet;
  userSelfPut: typeof userSelfPut;
} => {
  if (baseConfig == null) {
    return {
      entitlementGet,
      experimentIdDelete,
      experimentIdDriftIdDelete,
      experimentIdDriftIdGet,
      experimentIdDriftIdPut,
      experimentIdDriftPost,
      experimentIdDriftSearchPost,
      experimentIdGet,
      experimentIdPut,
      experimentPost,
      experimentSearchPost,
      userPost,
      userSearchPost,
      userSelfGet,
      userSelfPut,
    };
  }
  return {
    entitlementGet: ((args: Parameters<typeof entitlementGet>[0] = {}) =>
      entitlementGet({ config: mergeConfigs(baseConfig, args?.config) })) as typeof entitlementGet,
    experimentIdDelete: ((args: Parameters<typeof experimentIdDelete>[0]) =>
      experimentIdDelete({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdDelete,
    experimentIdDriftIdDelete: ((args: Parameters<typeof experimentIdDriftIdDelete>[0]) =>
      experimentIdDriftIdDelete({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdDriftIdDelete,
    experimentIdDriftIdGet: ((args: Parameters<typeof experimentIdDriftIdGet>[0]) =>
      experimentIdDriftIdGet({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdDriftIdGet,
    experimentIdDriftIdPut: ((args: Parameters<typeof experimentIdDriftIdPut>[0]) =>
      experimentIdDriftIdPut({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdDriftIdPut,
    experimentIdDriftPost: ((args: Parameters<typeof experimentIdDriftPost>[0]) =>
      experimentIdDriftPost({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdDriftPost,
    experimentIdDriftSearchPost: ((args: Parameters<typeof experimentIdDriftSearchPost>[0]) =>
      experimentIdDriftSearchPost({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdDriftSearchPost,
    experimentIdGet: ((args: Parameters<typeof experimentIdGet>[0]) =>
      experimentIdGet({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdGet,
    experimentIdPut: ((args: Parameters<typeof experimentIdPut>[0]) =>
      experimentIdPut({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentIdPut,
    experimentPost: ((args: Parameters<typeof experimentPost>[0]) =>
      experimentPost({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentPost,
    experimentSearchPost: ((args: Parameters<typeof experimentSearchPost>[0]) =>
      experimentSearchPost({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof experimentSearchPost,
    userPost: ((args: Parameters<typeof userPost>[0] = {}) =>
      userPost({ config: mergeConfigs(baseConfig, args?.config) })) as typeof userPost,
    userSearchPost: ((args: Parameters<typeof userSearchPost>[0]) =>
      userSearchPost({
        ...args,
        config: mergeConfigs(baseConfig, args.config),
      })) as typeof userSearchPost,
    userSelfGet: ((args: Parameters<typeof userSelfGet>[0] = {}) =>
      userSelfGet({ config: mergeConfigs(baseConfig, args?.config) })) as typeof userSelfGet,
    userSelfPut: ((args: Parameters<typeof userSelfPut>[0] = {}) =>
      userSelfPut({ config: mergeConfigs(baseConfig, args?.config) })) as typeof userSelfPut,
  };
};

export default buildClient;

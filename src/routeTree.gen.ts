/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as IndexImport } from './routes/index'
import { Route as ExperimentExperimentIdIndexImport } from './routes/experiment.$experimentId/index'

// Create/Update Routes

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const ExperimentExperimentIdIndexRoute =
  ExperimentExperimentIdIndexImport.update({
    id: '/experiment/$experimentId/',
    path: '/experiment/$experimentId/',
    getParentRoute: () => rootRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/experiment/$experimentId/': {
      id: '/experiment/$experimentId/'
      path: '/experiment/$experimentId'
      fullPath: '/experiment/$experimentId'
      preLoaderRoute: typeof ExperimentExperimentIdIndexImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/experiment/$experimentId': typeof ExperimentExperimentIdIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/experiment/$experimentId': typeof ExperimentExperimentIdIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/experiment/$experimentId/': typeof ExperimentExperimentIdIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/experiment/$experimentId'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/experiment/$experimentId'
  id: '__root__' | '/' | '/experiment/$experimentId/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  ExperimentExperimentIdIndexRoute: typeof ExperimentExperimentIdIndexRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  ExperimentExperimentIdIndexRoute: ExperimentExperimentIdIndexRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/experiment/$experimentId/"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/experiment/$experimentId/": {
      "filePath": "experiment.$experimentId/index.tsx"
    }
  }
}
ROUTE_MANIFEST_END */

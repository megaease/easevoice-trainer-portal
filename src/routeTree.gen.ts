/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutRouteImport } from './routes/_layout/route'
import { Route as LayoutIndexImport } from './routes/_layout/index'
import { Route as LayoutDashboardIndexImport } from './routes/_layout/dashboard/index'

// Create Virtual Routes

const LayoutVoiceCloneIndexLazyImport = createFileRoute(
  '/_layout/voice-clone/',
)()
const LayoutModelTrainingIndexLazyImport = createFileRoute(
  '/_layout/model-training/',
)()
const LayoutAboutIndexLazyImport = createFileRoute('/_layout/about/')()

// Create/Update Routes

const LayoutRouteRoute = LayoutRouteImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const LayoutIndexRoute = LayoutIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => LayoutRouteRoute,
} as any)

const LayoutVoiceCloneIndexLazyRoute = LayoutVoiceCloneIndexLazyImport.update({
  id: '/voice-clone/',
  path: '/voice-clone/',
  getParentRoute: () => LayoutRouteRoute,
} as any).lazy(() =>
  import('./routes/_layout/voice-clone/index.lazy').then((d) => d.Route),
)

const LayoutModelTrainingIndexLazyRoute =
  LayoutModelTrainingIndexLazyImport.update({
    id: '/model-training/',
    path: '/model-training/',
    getParentRoute: () => LayoutRouteRoute,
  } as any).lazy(() =>
    import('./routes/_layout/model-training/index.lazy').then((d) => d.Route),
  )

const LayoutAboutIndexLazyRoute = LayoutAboutIndexLazyImport.update({
  id: '/about/',
  path: '/about/',
  getParentRoute: () => LayoutRouteRoute,
} as any).lazy(() =>
  import('./routes/_layout/about/index.lazy').then((d) => d.Route),
)

const LayoutDashboardIndexRoute = LayoutDashboardIndexImport.update({
  id: '/dashboard/',
  path: '/dashboard/',
  getParentRoute: () => LayoutRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutRouteImport
      parentRoute: typeof rootRoute
    }
    '/_layout/': {
      id: '/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof LayoutIndexImport
      parentRoute: typeof LayoutRouteImport
    }
    '/_layout/dashboard/': {
      id: '/_layout/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof LayoutDashboardIndexImport
      parentRoute: typeof LayoutRouteImport
    }
    '/_layout/about/': {
      id: '/_layout/about/'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof LayoutAboutIndexLazyImport
      parentRoute: typeof LayoutRouteImport
    }
    '/_layout/model-training/': {
      id: '/_layout/model-training/'
      path: '/model-training'
      fullPath: '/model-training'
      preLoaderRoute: typeof LayoutModelTrainingIndexLazyImport
      parentRoute: typeof LayoutRouteImport
    }
    '/_layout/voice-clone/': {
      id: '/_layout/voice-clone/'
      path: '/voice-clone'
      fullPath: '/voice-clone'
      preLoaderRoute: typeof LayoutVoiceCloneIndexLazyImport
      parentRoute: typeof LayoutRouteImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteRouteChildren {
  LayoutIndexRoute: typeof LayoutIndexRoute
  LayoutDashboardIndexRoute: typeof LayoutDashboardIndexRoute
  LayoutAboutIndexLazyRoute: typeof LayoutAboutIndexLazyRoute
  LayoutModelTrainingIndexLazyRoute: typeof LayoutModelTrainingIndexLazyRoute
  LayoutVoiceCloneIndexLazyRoute: typeof LayoutVoiceCloneIndexLazyRoute
}

const LayoutRouteRouteChildren: LayoutRouteRouteChildren = {
  LayoutIndexRoute: LayoutIndexRoute,
  LayoutDashboardIndexRoute: LayoutDashboardIndexRoute,
  LayoutAboutIndexLazyRoute: LayoutAboutIndexLazyRoute,
  LayoutModelTrainingIndexLazyRoute: LayoutModelTrainingIndexLazyRoute,
  LayoutVoiceCloneIndexLazyRoute: LayoutVoiceCloneIndexLazyRoute,
}

const LayoutRouteRouteWithChildren = LayoutRouteRoute._addFileChildren(
  LayoutRouteRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof LayoutRouteRouteWithChildren
  '/': typeof LayoutIndexRoute
  '/dashboard': typeof LayoutDashboardIndexRoute
  '/about': typeof LayoutAboutIndexLazyRoute
  '/model-training': typeof LayoutModelTrainingIndexLazyRoute
  '/voice-clone': typeof LayoutVoiceCloneIndexLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof LayoutIndexRoute
  '/dashboard': typeof LayoutDashboardIndexRoute
  '/about': typeof LayoutAboutIndexLazyRoute
  '/model-training': typeof LayoutModelTrainingIndexLazyRoute
  '/voice-clone': typeof LayoutVoiceCloneIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_layout': typeof LayoutRouteRouteWithChildren
  '/_layout/': typeof LayoutIndexRoute
  '/_layout/dashboard/': typeof LayoutDashboardIndexRoute
  '/_layout/about/': typeof LayoutAboutIndexLazyRoute
  '/_layout/model-training/': typeof LayoutModelTrainingIndexLazyRoute
  '/_layout/voice-clone/': typeof LayoutVoiceCloneIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/'
    | '/dashboard'
    | '/about'
    | '/model-training'
    | '/voice-clone'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/dashboard' | '/about' | '/model-training' | '/voice-clone'
  id:
    | '__root__'
    | '/_layout'
    | '/_layout/'
    | '/_layout/dashboard/'
    | '/_layout/about/'
    | '/_layout/model-training/'
    | '/_layout/voice-clone/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  LayoutRouteRoute: typeof LayoutRouteRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  LayoutRouteRoute: LayoutRouteRouteWithChildren,
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
        "/_layout"
      ]
    },
    "/_layout": {
      "filePath": "_layout/route.tsx",
      "children": [
        "/_layout/",
        "/_layout/dashboard/",
        "/_layout/about/",
        "/_layout/model-training/",
        "/_layout/voice-clone/"
      ]
    },
    "/_layout/": {
      "filePath": "_layout/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/dashboard/": {
      "filePath": "_layout/dashboard/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/about/": {
      "filePath": "_layout/about/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/model-training/": {
      "filePath": "_layout/model-training/index.lazy.tsx",
      "parent": "/_layout"
    },
    "/_layout/voice-clone/": {
      "filePath": "_layout/voice-clone/index.lazy.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */

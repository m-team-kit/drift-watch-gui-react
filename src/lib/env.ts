import { string } from '@/lib/string';

// API Environment variables:
export const API_BASEPATH = string(import.meta.env['VITE_API_BASEPATH']);

// URL Environment variables:
export const ACCEPTABLE_USE_POLICY_URL = string(import.meta.env['VITE_ACCEPTABLE_USE_POLICY_URL']);
export const PRIVACY_POLICY_URL = string(import.meta.env['VITE_PRIVACY_POLICY_URL']);
export const LEGALS_URL = string(import.meta.env['VITE_LEGALS_URL']);
export const DOCS_URL = string(import.meta.env['VITE_DOCS_URL']);
export const GITHUB_URL = string(import.meta.env['VITE_GITHUB_URL']);

// OIDC environment variables:
export const OIDC_CLIENT_ID = string(import.meta.env['VITE_OIDC_CLIENT_ID']);
export const OIDC_REDIRECT_URL = string(import.meta.env['VITE_OIDC_REDIRECT_URL']);
export const OIDC_SCOPES = string(import.meta.env['VITE_OIDC_SCOPES']);
export const OIDC_AUTHORITY = string(import.meta.env['VITE_OIDC_AUTHORITY']);
export const OIDC_ENDPOINTS_AUTHORIZATION = string(import.meta.env['VITE_OIDC_ENDPOINTS_AUTHORIZATION']);
export const OIDC_ENDPOINTS_TOKEN = string(import.meta.env['VITE_OIDC_ENDPOINTS_TOKEN']);
export const OIDC_ENDPOINTS_USERINFO = string(import.meta.env['VITE_OIDC_ENDPOINTS_USERINFO']);
export const OIDC_ENDPOINTS_REVOCATION = string(import.meta.env['VITE_OIDC_ENDPOINTS_REVOCATION']);
export const OIDC_AUTO_LOGIN = string(import.meta.env['VITE_OIDC_AUTO_LOGIN']);

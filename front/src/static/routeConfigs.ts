import { API_SERVER_BASE_URL } from "../constants";

export const ROOT_PATH = "/";

export const SPACE_PATH_PATTERN = "spaces/:spaceId";

export function pathToSpace(spaceId: string) {
  return `/spaces/${spaceId}`;
}

export const SPACES_FLOW_PATH_PATTERN = "spaces_flow/:spaceId";

export function pathToSpaceFlow(spaceId: string) {
  return `/spaces_flow/${spaceId}`;
}

export const LOGIN_PATH = `${API_SERVER_BASE_URL}/login`;
export const LOGOUT_PATH = `${API_SERVER_BASE_URL}/logout`;

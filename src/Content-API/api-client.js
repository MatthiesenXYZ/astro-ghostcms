import GhostContentAPI from './ghostContentAPI';

// CALL GHOST VARS AND CREATE CLIENT
const key = import.meta.env.CONTENT_API_KEY;
const url = import.meta.env.CONTENT_API_URL;
const version = "v5.0"

export const api = new GhostContentAPI({ key, url, version })
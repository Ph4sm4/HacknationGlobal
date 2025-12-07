import type Opaque from 'ts-opaque';

export type AppAccessToken = Opaque<string, 'AccessToken'>;

export type AppRefreshToken = Opaque<string, 'RefreshToken'>;

export type SpotifyAccessToken = Opaque<string, 'SpotifyAccessToken'>;

export type SpotifyRefreshToken = Opaque<string, 'SpotifyRefreshToken'>;

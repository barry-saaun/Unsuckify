declare module "spotify-api" {
  export type CurrentUsersProfileResponse =
    SpotifyApi.CurrentUsersProfileResponse
  export type ListOfCurrentUsersPlaylistsResponse =
    SpotifyApi.ListOfCurrentUsersPlaylistsResponse
  export type SinglePlaylistResponse = SpotifyApi.SinglePlaylistResponse
}

declare module "tailwindcss/lib/util/flattenColorPalette" {
  const flattenColorPalette: (
    colors: Record<string, any>
  ) => Record<string, string>
  export default flattenColorPalette
}

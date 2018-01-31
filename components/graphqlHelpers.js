import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export const followPlaylistMutation = gql`
mutation ($ownerId: String!, $playlistId: String!, $isPublic: Boolean = true) {
    followPlaylist(ownerId: $ownerId, playlistId: $playlistId, isPublic: $isPublic) {
      id
      following
    }
}
`

export const unfollowPlaylistMutation = gql`
mutation ($ownerId: String!, $playlistId: String!) {
    unfollowPlaylist(ownerId: $ownerId, playlistId: $playlistId) {
      id
      following
    }
}
`

export const withFollowPlaylist = graphql(followPlaylistMutation, { name: 'followPlaylist' })
export const withUnfollowPlaylist = graphql(unfollowPlaylistMutation, { name: 'unfollowPlaylist' })
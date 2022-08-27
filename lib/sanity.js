import { createClient, createCurrentUserHook } from 'next-sanity'
import createImageUrlBuilder from '@sanity/image-url'

import { config } from './config'

if (!config.projectId) {
  throw Error('The Project ID is not set. Check your environment variables.')
}
/**
 * Set up a helper function for generating Image URLs with only the asset reference data in your documents
 */

export const urlFor = (source) => createImageUrlBuilder(config).image(source)

export const imageBuilder = (source) =>
  createImageUrlBuilder(config).image(source)

export const sanityClient = createClient(config)

// Helper function for using the current logged in user account
export const useCurrentUser = createCurrentUserHook(config)

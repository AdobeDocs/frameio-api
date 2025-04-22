/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

module.exports = {
  pathPrefix: process.env.PATH_PREFIX || '/frameio/',
  siteMetadata: {
    siteUrl: 'https://developer.adobe.com',
    pages: [
      {
        title: 'Frame.io API',
        path: '/'
      },
      {
        title: 'Guides',
        path: '/guides/'
      },
      {
        title: 'API Reference',
        menu: [
          {
            title: 'Current Version',
            description: 'Stable',
            path: '/api/current/index.md'
          },
          {
            title: 'Alpha Version',
            description: 'Active Development',
            path: '/api/alpha/index.md'
          }
        ]
      }
    ],
    subPages: [
      {
        title: 'Getting Started',
        path: '/guides/',
      },
      {
        title: 'Frequently Asked Questions',
        path: '/guides/FAQ/',
      },
      {
        title: 'Authentication',
        path: '/guides/Authentication'
      },
      {
        title: 'Migration',
        path: '/guides/Migration'
      }
    ]
  },
  plugins: [
    `@adobe/gatsby-theme-aio`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        query: `
        {
          site {
            pathPrefix
            siteMetadata {
              siteUrl
            }
          }
          allSitePage {
            nodes {
              path
            }
          }
        }
        `,
        resolvePages: ({ allSitePage: { nodes: allPages } }) => {
          return allPages.map(page => {
            return { ...page }
          })
        },
        serialize: ({ site, path }) => {
          return {
            url: site.siteMetadata.siteUrl + site.siteMetadata.pathPrefix + path,
            changefreq: 'daily',
            priority: 0.9,
          }
        },
      },
    },
  ]
};

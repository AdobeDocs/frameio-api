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
            title: 'Experimental Version',
            description: 'Experimental Development',
            path: '/api/experimental/index.md'
          }
        ]
      }
    ],
    subPages: [
      {
        title: 'Getting Started',
        path: '/guides/'
      },
      {
        title: 'Changelog',
        path: '/guides/Changelog/'
      },
      {
        title: 'FAQs',
        path: '/guides/FAQ/'
      },
      {
        title: 'Authentication',
        path: '/guides/Authentication'
      },
      {
        title: 'Authorization to File Upload',
        path: '/guides/Authorization to File Upload'
      },
      {
        title: 'Accounts, Projects, and Workspaces',
        path: '/guides/Accounts, Projects, and Workspaces'
      },
      {
        title: 'Custom Actions',
        path: '/guides/Custom Actions'
      },
      {
        title: 'Migration',
        path: '/guides/Migration'
      },
      {
        title: 'Webhooks',
        path: '/guides/Webhooks'
      },   
      {
        title: 'Zapier',
        path: '/guides/Zapier',
        pages: [
          {
            title: 'Introduction to Zapier',
            path: '/guides/Zapier/index.md'
          },
          {
            title: 'Setting Up Zapier',
            path: '/guides/Zapier/Setting Up Zapier'
          },
          {
            title: 'How-To Guide',
            path: '/guides/Zapier/How-To Guide'
          },
          {
            title: 'Frame.io Resources in Zapier V4',
            path: '/guides/Zapier/Frame.io Resources in Zapier V4'
          },
          {
            title: 'Migrating from Legacy to V4',
            path: '/guides/Zapier/Migrating from Legacy to V4'
          }
        ]
      }
    ]
  },
  plugins: [`@adobe/gatsby-theme-aio`]
};

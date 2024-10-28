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
            title: 'Frame.io API',
            description: 'v4.0 Current',
            path: '/api/current/index.md'
          },
        ]
      }
    ],
    subPages: [
      {
        title: 'Getting Started',
        path: '/guides/'
      },
      {
        title: 'Webhooks',
        path: '/guides/webhooks/'
      }
    ]
  },
  plugins: [`@adobe/gatsby-theme-aio`]
};
  
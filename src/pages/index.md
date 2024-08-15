---
title: Overview - Frame.io API
description: This is the overview page of the Frame.io API
contributors:
  - https://github.com/icaraps 
---

<Hero slots="heading, text"/>

# Frame.io API

Frame.io API offers limitless ways to integrate your most important customer data into key business processes. Cat Product API offer limitless ways.

<Resources slots="heading, links"/>

#### Resources

* [Quickstart Guide](https://developer.adobe.com)
* [Frame.io API Docs Github Repo](https://github.com/AdobeDocs/frameio-api)

## Overview

This documentation provides instructions for Frame.io APIs. For working with Frame.io APIs, see [Frame.io API Documentation](https://github.com/AdobeDocs/frameio-api).

## Discover

<DiscoverBlock width="100%" slots="heading, link, text"/>

### Get Started

[Quickstart Guide](guides/)

Get started with the Frame.io APIs.

<DiscoverBlock slots="heading, link, text"/>

### Guides

[Frame.io API](guides/api/)

Returns information on the user's company that is necessary for making other Frame.io API calls.

<DiscoverBlock slots="link, text"/>

### API References

[Try the API](api/)

Try the Analytics API with Swagger UI. Explore, make calls, with full endpoint descriptions.

## Contributing

We encourage you to participate in our open documentation initiative, if you have suggestions, corrections, additions
or deletions for this documentation, check out the source from [this github repo](https://github.com/adobe/gatsby-theme-spectrum-example), and submit a pull
request with your contribution. For more information, refer to the [contributing page](support/contribute/).

## API Requests & Rate Limits

The timeout for API requests through adobe.io is currently *60 seconds*.

The default rate limit is *120 requests per minute*. (The limit is enforced as *12 requests every 6 seconds*).
When rate limiting is being enforced you will get `429` HTTP response codes with the following response body: `{"error_code":"429050","message":"Too many requests"}`.

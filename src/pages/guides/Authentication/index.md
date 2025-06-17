# Authentication Guide {#authentication-guide}

Adobe is committed to the privacy and security of our users and their data. The first step in accessing the Frame.io API is authentication.
For Frame.io via our integration with Adobe Business Platform (ABP) and Identity Management Service (IMS), there are authentication types for several use cases.

* **OAuth Server to Server Authentication:** This allows technical or service user accounts to take action. They are also known as service or system accounts or bot users. When authenticating this way you are not required to complete the classic sign-up / sign-in (SUSI) process.
* **OAuth User Authentication:** This functions as the user whose token it is.

## User Authentication {#user-authentication}

Add the Frame.io V4 API with one of the user authentication credentials available. The steps here walk you through how to create the user authentication credentials and generate an access token and make your first API call.

1. **OAuth Web App**: If the API is added as a web app, use this credential. Go  [here](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation/#oauth-web-app-credential) for more information.
2. **OAuth Single Page App**: If the API is added as a single page app, use this credential. Go [here](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation/#oauth-single-page-app-credential) for details.
3. **OAuth Native App**: If the API is configured as a Native app, use this credential.  Details are [here](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation/#oauth-native-app-credential).

## Server to Server Authentication {#server-to-server-authentication}

Frame.io's V4 API supports service account users to connect the tools and systems critical to your creative process with your Frame.io account.

> See [Automate your setup using Frame.io server to server support](https://helpx.adobe.com/enterprise/using/automate-using-frame-io.html) for more information.

Server-to-server authentication credentials allow your application's server to generate access tokens and make API calls on behalf of your application within a service account user. Service account users are distinguishable from standard user accounts because they can perform actions on behalf of the service and a user that are viewable by other users.

When a service account user performs an action, the service account user name is displayed in Frame.io. Users can grant and revoke service account users via the Adobe Admin and Developer Consoles. Users can manage service account users within the Frame.io UI including names. The first S2S connection you make will be called **Service Account User** by default, the second **Service Account User 2** by default, and so on.

## Adobe Identity Management Service (IMS) {#adobe-identity-management-service-ims}

Adobe Identity Management Service (IMS) is Adobe’s OAuth 2.0-based identity management feature that supports authentication. There are two steps required for generating the access token.

1. First, the user authorizes the application before a token is generated. Details are [here](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/ims/#authorize-request).
2. Next, fetch the access token. The above step returns a code in the response body needed in this step. See the exact endpoints to access, and the parameters to use, [here](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/ims/#fetching-access-tokens).

> The above steps are required for all the three types of app credentials. There are differences in the way the IMS endpoints `/authorize/v2` and `/token/v3` are accessed to get the token. After you have the access token, you can use it to interact with the Frame.io V4 API.

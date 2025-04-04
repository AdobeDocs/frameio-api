# [Frame.io](http://frame.io/) Legacy API → V4 Migration Guide

## Introduction

Frame.io’s V4 API is a complete redesign of the Legacy API, often referred to as _V2 endpoints_ or _Frame.io V3 API_. The redesign takes full advantage of the new capabilities and features of Frame V4 while maintaining Legacy API access.  
  
This guide outlines the key differences between the Legacy and V4 APIs and provides step-by-step guidance to help you migrate your integration smoothly.  
  

## Key Differences

- **API access and management**: The V4 APIs are managed through the [Adobe Developer Console](https://developer.adobe.com/developer-console/), whereas the Legacy API was managed in the [Frame.io](http://Frame.io) developer site.
- **Assets → Folders & Files**: Distinct endpoints for files and folders in V4, unlike unified asset endpoints in Legacy.
- **Authentication:** The V4 API exclusively uses OAuth2.0 (`authorization_code` grant type). The Legacy API which allowed for JWT auth and Developer Tokens are no longer supported.

- There are 3 distinct new ways to obtain user authentication credentials when you create your project in the [Adobe Developer Console](https://developer.adobe.com/developer-console/):

- [OAuth Web App credential](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation#oauth-web-app-credential)
- [OAuth Single Page App credential](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation#oauth-single-page-app-credential)
- [OAuth Native App credential](https://developer.adobe.com/developer-console/docs/guides/authentication/UserAuthentication/implementation#oauth-native-app-credential)

- V4 Authorization URL: [https://ims-na1.adobelogin.com/ims/authorize/v2](https://ims-na1.adobelogin.com/ims/authorize/v2)
- Legacy Authorization URL: [https://applications.frame.io/oauth2/auth](https://applications.frame.io/oauth2/auth)

- **Review and Presentation links → Share links**: Review and presentation links, which were two distinct ways of sharing content in V3, have been consolidated into a single “share link” in V4 with support for different custom branding options.
- **Teams → Workspaces**: “Team” endpoints in the Legacy API have been replaced by “Workspace” endpoints in V4.
- **Parity with Legacy APIs:** Some specialized legacy callsare not yet supported in V4.

  

---

## Migration Checklist

1. **Audit** **existing Legacy API calls.** Compare existing calls to the tables below. If an endpoint you use is **not in this list**, it does not yet exist in V4—please submit your feedback via this form.
2. **Implement OAuth2.0 via the Adobe developer console**. Legacy [Frame.io](http://frame.io/) developer tokens and existing OAuth apps managed via [developer.frame.io](http://developer.frame.io/) will not work on V4 accounts.
3. **Refactor your code.** Use the new V4 API routes and JSON payloads (e.g., files/folders vs. assets).
4. **Test thoroughly.** Test with a V4 account, focusing on uploads, comments, and _webhooks_.
5. **Remove legacy code paths.** Remove any code paths that leverage Legacy API endpoints as they will fail in V4.
6. Implement a dedicated login method for V4 due to separate Auth URLs. Since the V4 Auth URL is different than the Legacy API, it will not return Legacy accounts in the response and should be treated as a separate integration.

**Note**: This list is not exhaustive of the direct correlation of Legacy APIs to the V4 APIs and will be updated regularly as new endpoints are released, potentially via Alpha version. If there is an endpoint that is not listed here that you have questions about, please reach out to our support team for more at [support@frame.io](mailto:support@frame.io)  

---

## Legacy API Features Coming Soon

The [Frame.io](http://Frame.io) V4 API is rapidly evolving and there are some features the Legacy API offered which we plan to support in the near future.  
  
**These features include:**  

- Audit Logs
- Custom actions
- Search
- Comment likes, replies, & statuses

  

---

## Authentication

1. **Create a project in the Adobe Developer Console** and add [Frame.io](http://Frame.io) as a product.
2. **Authenticate.**

3. The Frame V4 APIs support to **two types of authentication:** user authentication and server to server. The options depend on how your users are managed.

4. **Frame managed**: If you manage users (i.e. add or remove users) in the Frame application, then your account is “Frame managed”. This account type only support user authentication
5. **Adobe managed**: If you manage users in the Adobe Admin console, then your account is Adobe managed. This account type supports user authentication and server to server authentication

6. **User authentication**: Connects to Frame using a Client ID and/or Client Secret, and requires a user to login with their username and password
7. **Server to server authentication**: Connects to Frame using Client ID and Client Secret, but does not require a user in the loop to login via a browser.

8. **JWT Bearer Auth**: For every API request pass the auth token via a header with key `Authorization` and a value of `Bearer <IMS_ACCESS_TOKEN>`.

---

## Endpoint Mappings (Legacy API → V4)

The table below **only** includes Legacy API endpoints that **do** have a V4 equivalent. If you don’t see your Legacy API call here, and wasn’t called out already in the “coming soon” section above, it’s likely **deprecated** with no direct migration path.  

### 1. Accounts & User Info

| Legacy Method | Legacy Endpoint                                                                                                | V4 Method | V4 Endpoint                                                                                                                   | Notes                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| GET           | `/v2/accounts`  <br>([Get Accounts for User](https://developer.frame.io/api/reference/operation/getAccounts/)) | GET       | `/v4/accounts`  <br>([List accounts](https://developer.adobe.com/frameio/api/current/#tag/Accounts/operation/accounts.index)) | V4 returns all accounts the user can access. |
| GET           | `/v2/me`                                                                                                       | GET       | `/v4/me`                                                                                                                      | Fetch current user’s profile.                |

### 2. Workspaces (Replaced Team Endpoints)

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|GET|`/v2/accounts/{account_id}/teams`  <br>([Get all Teams on an Account](https://developer.frame.io/api/reference/operation/getTeamsByAccount/))|GET|`/v4/accounts/{account_id}/workspaces`  <br>([List workspaces](https://developer.adobe.com/frameio/api/current/#tag/Workspaces/operation/workspaces.index))|Legacy API concept of “teams” → “workspaces” in V4.|
|POST|`/v2/accounts/{account_id}/teams`  <br>([Create a Team for the given account](https://developer.frame.io/api/reference/operation/createTeam/))|POST|`/v4/accounts/{account_id}/workspaces`  <br>([Create workspace](https://developer.adobe.com/frameio/api/current/#tag/Workspaces/operation/workspaces.create))|Body is similar (name, etc.). Response is a workspace object, not a team object.|
|GET|`/v2/teams/{team_id}`  <br>([Get a Team](https://developer.frame.io/api/reference/operation/getTeam/))|GET|`/v4/accounts/{account_id}/workspaces/{workspace_id}`  <br>([Show Workspace](https://developer.adobe.com/frameio/api/current/#tag/Workspaces/operation/workspaces.index))|Team ID → Workspace ID in V4.|
|GET|`/v2/teams/{team_id}/members`  <br>([Get Team Members](https://developer.frame.io/api/reference/operation/getTeamMembers/))|GET|`/v4/accounts/{account_id}/workspaces/{workspace_id}/users`  <br>[(Get Workspace Members)](https://developer.adobe.com/frameio/api/alpha/#tag/Workspace-Permissions/operation/workspace_user_roles.index)|Returns all users in a workspace (available in the alpha API)|
|POST|`/v2/teams/{team_id}/members`  <br>([Add a Team Member)](https://developer.frame.io/api/reference/operation/addTeamMember/)|PATCH|`/v4/accounts/{account_id}/workspaces/{workspace_id}/users/{user_id}`  <br>([Add Or Update User Role In Workspace](https://developer.adobe.com/frameio/api/alpha/#tag/Workspace-Permissions/operation/workspace_user_roles.update))|Allows for adding or removing users from a workspace (available in the alpha API)|

### 3. Projects

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|GET|`/v2/teams/{team_id}/projects`  <br>([Get Projects by Team](https://developer.frame.io/api/reference/operation/getProjectsByTeam/))|GET|`/v4/accounts/{account_id}/workspaces/{workspace_id}/projects`  <br>([List Projects](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.index))|Must provide both `account_id` & `workspace_id` in V4.|
|POST|`/v2/teams/{team_id}/projects`  <br>([Create a Project](https://developer.frame.io/api/reference/operation/createProject/))|POST|`/v4/accounts/{account_id}/workspaces/{workspace_id}/projects`  <br>([Create project](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.create))|Body is similar: `{ "name": "MyProject", ... }`.|
|GET|`/v2/projects/{project_id}`  <br>([Get Project by ID](https://developer.frame.io/api/reference/operation/getProject/))|GET|`/v4/accounts/{account_id}/projects/{project_id}`  <br>([Show project](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.show))|Requires `account_id` & `project_id`|
|PUT|`/v2/projects/{project_id}`  <br>([Update a Project](https://developer.frame.io/api/reference/operation/updateProject/))|PATCH|`/v4/accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}`  <br>([Update project](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.update))|V4 uses PATCH for partial updates.|
|DELETE|`/v2/projects/{project_id}`  <br>[(Delete Project by ID)](https://developer.frame.io/api/reference/operation/deleteProject/)|DELETE|`/v4/accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}`  <br>[(Delete Project)](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.delete)|Removes project.|
|GET|`/v2/projects/{project_id}/collaborators`  <br>([Get Project Collaborators](https://developer.frame.io/api/reference/operation/getProjectCollaborators/))|GET|`/v4/accounts/{account_id}/projects/{project_id}/users`|Returns all the users in a project (available in the V4 alpha API)|
|POST|`/v2/projects/{project_id}/collaborators`  <br>([Add a Collaborator to a Project](https://developer.frame.io/api/reference/operation/addCollaboratorToProject/))|PATH|`/v4/accounts/{account_id}/projects/{project_id}/users/{user_id}`|Allows for adding or removing users from a project (available in the V4 alpha API)|

### 4. Folders

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|GET|`/v2/assets/{asset_id}/children`  <br>([Fetch child Assets](https://developer.frame.io/api/reference/operation/getAssets/))|GET|`/v4/accounts/{account_id}/folders/{folder_id}/children`  <br>([List folder children](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.index))|If your `asset_id` in Legacy API was a folder, it’s now `folder_id` in V4.|
|POST|`/v2/assets/{parent_asset_id}/children`  <br>([Create an Asset](https://developer.frame.io/api/reference/operation/createAsset/))|POST|`/v4/accounts/{account_id}/folders/{folder_id}/folders`  <br>([Create folder](https://developer.adobe.com/frameio/api/current/#tag/Folders))|In Legacy API you used `"type": "folder"`, in V4 you do `{"data": {"name": "Folder name"}}`.|
|GET|`/v2/assets/{asset_id}`  <br>([Get an Asset](https://developer.frame.io/api/reference/operation/getAsset/))|GET|`/v4/accounts/{account_id}/folders/{folder_id}`  <br>([Show folder](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.index))|Legacy API requires "type": "folder"  <br>V4 API requires `folder_id` & `account_id` in path parameters|
|PUT|`/v2/assets/{asset_id}` ([Update an Asset](https://developer.frame.io/api/reference/operation/updateAsset/))|PATCH|`/v4/accounts/{account_id}/folders/{folder_id}`  <br>([Update folder](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.update))|Legacy API: `asset_id` will be your folder id  <br>V4 API: Body: `{"data": {"name": "New Folder Name"}}`.|
|DELETE|`/v2/assets/{asset_id}`  <br>([Delete an Asset](https://developer.frame.io/api/reference/operation/deleteAsset/))|DELETE|`/v4/accounts/{account_id}/folders/{folder_id}`  <br>([Delete folder)](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.delete)|Removes folder.|

### 5. Files

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|POST|`/v2/assets/{parent_asset_id}/children`  <br>([Create an Asset](https://developer.frame.io/api/reference/operation/createAsset/))|POST|`/v4/accounts/{account_id}/folders/{folder_id}/files`  <br>([Create file](https://developer.adobe.com/frameio/api/current/#tag/Files/operation/files.create))|Legacy API: requires name, type, filetype, filesize, & auto_version_id  <br>V4 API: account_id & folder_id are required in the path parameters, file_size, media_type_name required on payload|
|GET|`/v2/assets/{asset_id}`  <br>([Get an Asset](https://developer.frame.io/api/reference/operation/getAsset/))|GET|`/v4/accounts/{account_id}/files/{file_id}`  <br>([Show file)](https://developer.adobe.com/frameio/api/current/#tag/Files/operation/files.show)|V4 API: `api-version:alpha` is required to return `media_links` in response to enable downloading assets from Frame.io|
|PUT|`/v2/assets/{asset_id}`  <br>([Update an Asset](https://developer.frame.io/api/reference/operation/updateAsset/))|PATCH|`/v4/accounts/{account_id}/files/{file_id}`  <br>([Update file](https://developer.adobe.com/frameio/api/alpha/#tag/Files/operation/files.update))|Requires api-version:alpha for V4|
|DELETE|`/v2/assets/{asset_id}`  <br>([Delete an Asset](https://developer.frame.io/api/reference/operation/deleteAsset/))|DELETE|`/v4/accounts/{account_id}/files/{file_id}`  <br>([Delete file](https://developer.adobe.com/frameio/api/current/#tag/Files/operation/files.delete))|204 No Content on success.|
|POST|`/v2/assets/{asset_id}/version`  <br>([Version an Asset](https://developer.frame.io/api/reference/operation/addVersionToAsset/))|POST|`/v4/accounts/{account_id}/folders/{folder_id}/version_stacks`  <br>([Create version stack](https://developer.adobe.com/frameio/api/alpha/#tag/Version-Stacks/operation/version_stacks.create))|Requires api-version:alpha for V4|

### 6. Comments

While initial support for Commenting endpoints, have been released there are a number of missing capabilities which will be released in the future.  
  
Capabilities coming soon include:  
  
1) Support for range-based comments  
2) Support for leaving comment replies  
3) Support for comment attachments  
4) Support for comment reactions (I.e. emoji’s)  
5) Support for viewing or modifying comment completion status  
6) Support for hyperlinks or @mentions (comment entities)  
7) Support for seeing who has viewed a comment (impressions)  
  
Note: The “timestamp” field actually represents the framestamp the comment is left on (starting from 1), not the timestamp  

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|GET|`/v2/assets/{asset_id}/comments`  <br>([Get all the Comments and Replies from a Comment thread](https://developer.frame.io/api/reference/operation/getComments/))|GET|`/v4/accounts/{account_id}/files/{file_id}/comments`  <br>([List comments](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.index))|Lists comments on a file.|
|POST|`/v2/assets/{asset_id}/comments`  <br>([Create a Comment](https://developer.frame.io/api/reference/operation/createComment/))|POST|`/v4/accounts/{account_id}/files/{asset_id}/comments`  <br>([Create comment](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.create))|Create a comment. Body is similar: `{"text":"Nice","timestamp":12.3}`.|
|GET|`/v2/comments/{comment_id}`  <br>([Get a Comment by ID](https://developer.frame.io/api/reference/operation/getComment/))|GET|`` `/v4/accounts/{account_id}/`comments/{comment_id} ``  <br>([Show comment](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.show))|Fetch single comment by ID.|
|PUT|`/v2/comments/{comment_id}`  <br>([Update a Comment](https://developer.frame.io/api/reference/operation/updateComment/))|PATCH|`/v4/accounts/{account_id}/comments/{comment_id}`  <br>([Update comment)](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.update)|Update text, time, etc.|
|DELETE|`/v2/comments/{comment_id}`  <br>([Delete a Comment](https://developer.frame.io/api/reference/operation/deleteComment/))|DELETE|`/v4/accounts/{account_id}/comments/{comment_id}`  <br>([Delete comment](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.delete))|Remove comment.|

### 7. Shares (Review Links / Presentations)

In Frame V4 share links are no longer split between review and presentation links. In V4 the same link can now be configured with different styling to match the review or presentation experience.  

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|GET|`/v2/projects/{project_id}/review_links`  <br>([List Review Links in a project](https://developer.frame.io/api/reference/operation/reviewLinksList/))|GET|`/v4/accounts/{account_id}/projects/{project_id}/shares`  <br>([List shares](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.index))|Lists shares in a project|
|POST|`/v2/projects/{project_id}/review_links`  <br>([Create a Review Link)](https://developer.frame.io/api/reference/operation/reviewLinkCreate/)|POST|`/v4/accounts/{account_id}/projects/{project_id}/shares`  <br>([Create share](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.create))|Creates a new share link. Body might be `{"data":{"name":"Review Link","type":"review"}}`.|
|POST|`/v2/review_links/{link_id}/assets`  <br>([Add Asset to a Review Link](https://developer.frame.io/api/reference/operation/reviewLinkItemCreate/))|POST|`` `/v4/accounts/{account_id}/shares/`{share_id}/assets ``  <br>([Add new asset to share](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.add_asset))|Unclear if this supports files, folders, version stacks, etc - the API reference should be updated to clarify that|
|DELETE|Does not exist|DELETE|`` `/v4/accounts/{account_id}/shares/`{share_id}/assets/{asset_id} ``  <br>[(Delete Share)](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.remove_asset)|Remove asset from share|
|DELETE|`/v2/review_links/{link_id}`  <br>([Delete a Review Link](https://developer.frame.io/api/reference/operation/reviewLinkDelete/))|DELETE|`/v4/accounts/{account_id}/shares/{share_id}`  <br>[(Delete Share)](https://developer.adobe.com/frameio/api/alpha/#tag/Shares/operation/shares.delete)|Delete the share link.|
|PUT|`/v2/review_links/{review_link_id}`  <br>([Update a Review Link](https://developer.frame.io/api/reference/operation/reviewLinkUpdate/))|PATCH|`/v4/accounts/{account_id}/shares/{share_id}`  <br>[(Update Share)](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.update)|Update the share link|

### 8. Webhooks

Given the many changes to resources in [Frame.io](http://Frame.io) V4, and the Alpha state of Webhooks for V4, the number of supported “events” that you trigger Webhooks off of is very different.  
  

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|POST|`/v2/teams/{team_id}/hooks`  <br>[(Create Webhook)](https://developer.frame.io/api/reference/operation/createWebhookForTeam/)|POST|`/v4/accounts/{account_id}/workspaces/{workspaces_id}/webhooks`  <br>[(Create Webhook)](https://developer.adobe.com/frameio/api/alpha/#tag/Webhooks/operation/webhooks.create)|Provide `{"data":{"url":"...","events":["file.created",...]}}`.|
|N/A|N/A|GET|`/v4/accounts/{account_id}/workspaces/{workspaces_id}/webhooks`  <br>[(Get List)](https://developer.adobe.com/frameio/api/alpha/#tag/Webhooks/operation/webhooks.index)|Gets all webhooks for workspace|
|GET|`/v2/hooks/{hook_id}`  <br>[(Get Webhook)](https://developer.frame.io/api/reference/operation/getWebhook/)|GET|`/v4/accounts/{account_id}/webhooks/{webhook_id}`  <br>[(Get Webhook)](https://developer.adobe.com/frameio/api/alpha/#tag/Folders/operation/folders.index)|Get webhook info|
|PUT|`/v2/hooks/{hook_id}`  <br>[(Update Webhook)](https://developer.frame.io/api/reference/operation/updateWebhook/)|PATCH|`/v4/accounts/{account_id}webhooks/{webhook_id}`  <br>[(Update Webhook)](https://developer.adobe.com/frameio/api/alpha/#tag/Webhooks/operation/webhooks.update)|Update webhook settings|
|DELETE|`/v2/hooks/{hook_id}`  <br>[(Delete Webhook)](https://developer.frame.io/api/reference/operation/deleteWebhook/)|DELETE|`/v4/accounts/{account_id}/webhooks{webhook_id}`  <br>[(Delete Webhook)](https://developer.adobe.com/frameio/api/alpha/#tag/Webhooks/operation/webhooks.delete)|Removes the webhook.|

---

## Migration Steps

1. **Remove** any unsupported Legacy endpoints.
2. **Create a new Project** in Adobe Developer Console, choose your user authentication type, & implement OAuth support in your app.
3. **Update base URLs** from `api.frame.io/v2/...` to `api.frame.io/v4/...`.
4. **Update API requests** in your code to reference the new endpoints schema.
5. **Update JSON payloads** of request/response schemas to ensure you’re producing and consuming the correct fields.
6. Update terminology: “teams” → “workspaces”; “assets” → “files/folders”; “review links” or “presentation links” → “shares” in your code and your front-end.
7. **Test** all newly updated endpoints. If you see 403, 404, 422, confirm endpoints, request payload shape, etc.
8. **Parse** the new detailed error responses, looking for the issue in the `{"errors": [...]}` JSON response if your API call fails.
9. **Add** test users to your project via Adobe Developer Console.
10. **Deploy** to Production once validated with a V4 [Frame.io](http://frame.io/) account.

---

## Error Handling & Common Issues

- **400** Bad Request: Check payload accuracy.
- **401** Unauthorized: Refresh or re-authenticate OAuth tokens.
- **403** Forbidden: Missing scope or user lacks access.
- **404** Not Found: Confirm endpoint, API version, or IDs.
- **422** Unprocessable Entity: Validate request data
- **429** Rate limited: Implement retry with backoff.
- **500** server error: Retry after a brief delay.

---

**Legacy API endpoints currently unavailable in V4 API:**  

1. **Accounts & User Info**

2. `GET /v2/accounts/{account_id}`
3. `GET /v2/projects/shared`
4. `GET /v2/accounts/{account_id}/membership`

5. Files & Folders

6. `POST /v2/assets/{destination_folder}/move`
7. `POST /v2/assets/{destination_folder}/copy`
8. `DELETE /v2/assets/{asset_id}/unversion`

9. Teams / Workspaces

10. `GET /v2/teams/{team_id}/membership`

11. Comments

12. `GET /v2/comments/{comment_id}/impressions`

13. Shares

14. `GET /v2/review_links/{link_id}`

15. Webhooks

16. `GET /v2/accounts/{account_id}/webhooks`

  

# Parking Lot (Do not include in release)

## Code Examples (cURL & Python)

### Example: Creating a Folder (Legacy vs V4)

### Legacy

curl -X POST "<https://api.frame.io/v2/assets/12345/children>" \\\\  
     -H "Authorization: Bearer <V3_TOKEN>" \\\\  
     -H "Content-Type: application/json" \\\\  
     -d '{  
       "name": "MyFolder",  
       "type": "folder"  
     }'
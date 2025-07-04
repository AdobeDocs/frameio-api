
# Frame.io Legacy API to V4 Migration Guide

## Introduction

The Frame.io V4 API is a complete redesign of the Legacy API, often referred to as *V2 endpoints* or *Frame.io V3 API*. The redesign takes full advantage of the new capabilities and features of Frame V4 and is not backward compatible. This guide outlines the key differences between the Legacy and V4 APIs and provides step-by-step guidance to help you migrate smoothly.

## Key Differences

* **API access and management**: The V4 APIs are managed through the [Adobe Developer Console](https://developer.adobe.com/developer-console/), whereas the Legacy API was managed in the Frame.io developer site.
* **Assets → Folders & Files**: Distinct endpoints for files and folders in V4, unlike unified asset endpoints in Legacy.
* **Authentication:** The V4 API exclusively uses OAuth2.0 (`authorization_code` grant type). The Legacy API which allowed for JWT auth and Developer Tokens are no longer supported.
* **Parity with Legacy APIs:** Some specialized legacy callsare not yet supported in V4.
* **Review and Presentation links → Share links**: Review and presentation links, which were two distinct ways of sharing content in V3, have been consolidated into a single “share link” in V4 with support for different custom branding options.
* **Teams → Workspaces**: “Team” endpoints in the Legacy API have been replaced by “Workspace” endpoints in V4.

## Migration Checklist

1. **Audit** **existing Legacy API calls.** Compare existing calls to the tables below. If an endpoint you use is **not in this list**, it does not yet exist in V4—please submit your feedback via this form.
2. **Implement OAuth2.0 via the Adobe developer console**. Legacy Frame.io developer tokens and existing OAuth apps managed via [developer.frame.io](http://developer.frame.io/) will not work on V4 accounts.
3. **Refactor your code.**  Use the new V4 API routes and JSON payloads (e.g., files/folders vs. assets).
4. **Test thoroughly.** Test with a V4 account, focusing on uploads, comments, and *webhooks*.
5. **Remove legacy code paths.** Remove any code paths that leverage Legacy API endpoints as they will fail in V4.
6. Implement a dedicated login method for V4 due to separate Auth URLs. Since the V4 Auth URL is different than the Legacy API, it will not return Legacy accounts in the response and should be treated as a separate integration.

> **Note**: This list is not exhaustive of the direct correlation of Legacy APIs to the V4 APIs and will be updated regularly as new endpoints are released, potentially via Experimental version.  If there is an endpoint that is not listed here that you have questions about, please reach out to our support team for more at [support@frame.io](mailto:support@frame.io).

## Authentication

1. **Create a project in the Adobe Developer Console** and add Frame.io as a product.
2. **Authenticate.** See the [Authentication Guide](https://developer.adobe.com/frameio/guides/Authentication/) for more information.
    1. **User authentication**: Connects to Frame using a Client ID and/or Client Secret, and requires a user to login with their username and password.
    2. **Server to server authentication**: Connects to Frame using Client ID and Client Secret, but does not require a user in the loop to login via a browser.
3. **JWT Bearer Auth**: For  every API request, pass the auth token via a header with key `Authorization` and a value of `Bearer <IMS_ACCESS_TOKEN>`.

## Endpoint Mappings (Legacy API to V4)

The table below **only** includes Legacy API endpoints that **do** have a V4 equivalent. If you don’t see your Legacy API call here, it’s likely **deprecated** with no direct migration path.

 **1. Accounts & User Info**

| Legacy Method | Legacy Endpoint                                                                                                | V4 Method | V4 Endpoint                                                                                                                   | Notes                                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| GET           | `/v2/accounts`  <br />([Get Accounts for User](https://developer.frame.io/api/reference/operation/getAccounts/)) | GET       | `/v4/accounts`  <br />([List accounts](https://developer.adobe.com/frameio/api/current/#tag/Accounts/operation/accounts.index)) | V4 returns all accounts the user can access.                                                                                  |
| GET           | `/v2/accounts/{account_id}`                                                                                    | GET       | `/v4/accounts/{account_id}`                                                                                                   | Does not exist in V4  <br />Retrieves info about a specific account. In V4, references to “teams” are replaced by “workspaces.” |
| GET           | `/v2/me`                                                                                                       | GET       | `/v4/me`                                                                                                                      | Fetch current user’s profile.                                                                                                 |

 **2. Workspaces (Replaced Team Endpoints)**

| Legacy Method | Legacy Endpoint                                                                                                                                | V4 Method | V4 Endpoint                                                                                                                                                                                                                         | Notes                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| GET           | `/v2/accounts/{account_id}/teams`  <br />([Get all Teams on an Account](https://developer.frame.io/api/reference/operation/getTeamsByAccount/))  | GET       | `/v4/accounts/{account_id}/workspaces`  <br />([List workspaces](https://developer.adobe.com/frameio/api/current/#tag/Workspaces/operation/workspaces.index))                                                                         | Legacy API concept of “teams” → “workspaces” in V4.                               |
| POST          | `/v2/accounts/{account_id}/teams`  <br />([Create a Team for the given account](https://developer.frame.io/api/reference/operation/createTeam/)) | POST      | `/v4/accounts/{account_id}/workspaces`  <br />([Create workspace](https://developer.adobe.com/frameio/api/current/#tag/Workspaces/operation/workspaces.create))                                                                       | Body is similar (name, etc.). Response is a workspace object, not a team object.  |
| GET           | `/v2/teams/{team_id}`  <br />([Get a Team](https://developer.frame.io/api/reference/operation/getTeam/))                                         | GET       | `/v4/accounts/{account_id}/workspaces/{workspace_id}`  <br />([Show Workspace](https://developer.adobe.com/frameio/api/current/#tag/Workspaces/operation/workspaces.index))                                                           | Team ID → Workspace ID in V4.                                                     |
| GET           | `/v2/teams/{team_id}/members`  <br />([Get Team Members](https://developer.frame.io/api/reference/operation/getTeamMembers/))                    | GET       | `/v4/accounts/{account_id}/workspaces/{workspace_id}/users`  <br />[(Get Workspace Members)](https://developer.adobe.com/frameio/api/experimental/#tag/Workspace-Permissions/operation/workspace_user_roles.index)                           | Returns all users in a workspace (available in the experimental API)                     |
| POST          | `/v2/teams/{team_id}/members`  <br />([Add a Team Member)](https://developer.frame.io/api/reference/operation/addTeamMember/)                    | PATCH     | `/v4/accounts/{account_id}/workspaces/{workspace_id}/users/{user_id}`  <br />([Add Or Update User Role In Workspace](https://developer.adobe.com/frameio/api/experimental/#tag/Workspace-Permissions/operation/workspace_user_roles.update)) | Allows for adding or removing users from a workspace (available in the experimental API) |

 **3. Projects**

| Legacy Method | Legacy Endpoint                                                                                                                                                  | V4 Method | V4 Endpoint                                                                                                                                                                                  | Notes                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| GET           | `/v2/teams/{team_id}/projects`  <br />([Get Projects by Team](https://developer.frame.io/api/reference/operation/getProjectsByTeam/))                              | GET       | `/v4/accounts/{account_id}/workspaces/{workspace_id}/projects`  <br />([List Projects](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.index))                | Must provide both `account_id` & `workspace_id` in V4.                             |
| POST          | `/v2/teams/{team_id}/projects`  <br />([Create a Project](https://developer.frame.io/api/reference/operation/createProject/))                                      | POST      | `/v4/accounts/{account_id}/workspaces/{workspace_id}/projects`  <br />([Create project](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.create))              | Body is similar: `{ "name": "MyProject", ... }`.                                   |
| GET           | `/v2/projects/{project_id}`  <br />([Get Project by ID](https://developer.frame.io/api/reference/operation/getProject/))                                           | GET       | `/v4/accounts/{account_id}/projects/{project_id}`  <br />([Show project](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.show))                               | Requires `account_id` & `project_id`                                               |
| PUT           | `/v2/projects/{project_id}`  <br />([Update a Project](https://developer.frame.io/api/reference/operation/updateProject/))                                         | PATCH     | `/v4/accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}`  <br />([Update project](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.update)) | V4 uses PATCH for partial updates.                                                 |
| DELETE        | `/v2/projects/{project_id}`  <br />[(Delete Project by ID)](https://developer.frame.io/api/reference/operation/deleteProject/)                                     | DELETE    | `/v4/accounts/{account_id}/workspaces/{workspace_id}/projects/{project_id}`  <br />[(Delete Project)](https://developer.adobe.com/frameio/api/current/#tag/Projects/operation/projects.delete) | Removes project.                                                                   |
| GET           | `/v2/projects/{project_id}/collaborators`  <br />([Get Project Collaborators](https://developer.frame.io/api/reference/operation/getProjectCollaborators/))        | GET       | `/v4/accounts/{account_id}/projects/{project_id}/users`                                                                                                                                      | Returns all the users in a project (available in the V4 experimental API)                 |
| POST          | `/v2/projects/{project_id}/collaborators`  <br />([Add a Collaborator to a Project](https://developer.frame.io/api/reference/operation/addCollaboratorToProject/)) | PATH      | `/v4/accounts/{account_id}/projects/{project_id}/users/{user_id}`                                                                                                                            | Allows for adding or removing users from a project (available in the V4 experimental API) |

 **4. Folders**

| Legacy Method | Legacy Endpoint                                                                                                                   | V4 Method | V4 Endpoint                                                                                                                                                                  | Notes                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GET           | `/v2/assets/{asset_id}/children`  <br />([Fetch child Assets](https://developer.frame.io/api/reference/operation/getAssets/))       | GET       | `/v4/accounts/{account_id}/folders/{folder_id}/children`  <br />([List folder children](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.index)) | If your `asset_id` in Legacy API was a folder, it’s now `folder_id` in V4.                                |
| POST          | `/v2/assets/{parent_asset_id}/children`  <br />([Create an Asset](https://developer.frame.io/api/reference/operation/createAsset/)) | POST      | `/v4/accounts/{account_id}/folders/{folder_id}/folders`  <br />([Create folder](https://developer.adobe.com/frameio/api/current/#tag/Folders))                                 | In Legacy API you used `"type": "folder"`, in V4 you do `{"data": {"name": "Folder name"}}`.              |
| GET           | `/v2/assets/{asset_id}`  <br />([Get an Asset](https://developer.frame.io/api/reference/operation/getAsset/))                       | GET       | `/v4/accounts/{account_id}/folders/{folder_id}`  <br />([Show folder](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.index))                   | Legacy API requires "type": "folder"  <br />V4 API requires `folder_id` & `account_id` in path parameters   |
| PUT           | `/v2/assets/{asset_id}` ([Update an Asset](https://developer.frame.io/api/reference/operation/updateAsset/))                      | PATCH     | `/v4/accounts/{account_id}/folders/{folder_id}`  <br />([Update folder](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.update))                | Legacy API: `asset_id` will be your folder id  <br />V4 API: Body: `{"data": {"name": "New Folder Name"}}`. |
| DELETE        | `/v2/assets/{asset_id}`  <br />([Delete an Asset](https://developer.frame.io/api/reference/operation/deleteAsset/))                 | DELETE    | `/v4/accounts/{account_id}/folders/{folder_id}`  <br />([Delete folder)](https://developer.adobe.com/frameio/api/current/#tag/Folders/operation/folders.delete)                | Removes folder.                                                                                           |

 **5. Files**

| Legacy Method | Legacy Endpoint                                                                                                                   | V4 Method | V4 Endpoint                                                                                                                                                                                     | Notes                                                                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST          | `/v2/assets/{parent_asset_id}/children`  <br />([Create an Asset](https://developer.frame.io/api/reference/operation/createAsset/)) | POST      | `/v4/accounts/{account_id}/folders/{folder_id}/files`  <br />([Create file](https://developer.adobe.com/frameio/api/current/#tag/Files/operation/files.create))                                   | Legacy API: requires name, type, filetype, filesize, & auto_version_id  <br />V4 API: account_id & folder_id are required in the path parameters, file_size, media_type_name required on payload |
| GET           | `/v2/assets/{asset_id}`  <br />([Get an Asset](https://developer.frame.io/api/reference/operation/getAsset/))                       | GET       | `/v4/accounts/{account_id}/files/{file_id}`  <br />([Show file)](https://developer.adobe.com/frameio/api/current/#tag/Files/operation/files.show)                                                 | V4 API: `api-version:experimental` is required to return `media_links` in response to enable downloading assets from Frame.io                                                                         |
| PUT           | `/v2/assets/{asset_id}`  <br />([Update an Asset](https://developer.frame.io/api/reference/operation/updateAsset/))                 | PATCH     | `/v4/accounts/{account_id}/files/{file_id}`  <br />([Update file](https://developer.adobe.com/frameio/api/experimental/#tag/Files/operation/files.update))                                               | Requires api-version:experimental for V4                                                                                                                                                              |
| DELETE        | `/v2/assets/{asset_id}`  <br />([Delete an Asset](https://developer.frame.io/api/reference/operation/deleteAsset/))                 | DELETE    | `/v4/accounts/{account_id}/files/{file_id}`  <br />([Delete file](https://developer.adobe.com/frameio/api/current/#tag/Files/operation/files.delete))                                             | 204 No Content on success.                                                                                                                                                                     |
| POST          | `/v2/assets/{asset_id}/version`  <br />([Version an Asset](https://developer.frame.io/api/reference/operation/addVersionToAsset/))  | POST      | `/v4/accounts/{account_id}/folders/{folder_id}/version_stacks`  <br />([Create version stack](https://developer.adobe.com/frameio/api/experimental/#tag/Version-Stacks/operation/version_stacks.create)) | Requires api-version:experimental for V4                                                                                                                                                              |

**6. Comments**

Initial support for Commenting endpoints has been released. There are several additional capabilities that will be released soon. Support for coming soon capabilities includes:

* Range-based comments
  
* Leaving comment replies
* Comment attachments
* Comment reactions, i.e. emojis
* Viewing or modifying comment completion status
* Hyperlinks or @mentions (comment entities)
* Seeing who has viewed a comment (impressions)

> Note: The “timestamp” field represents the framestamp the comment is left on (starting from 1), not the timestamp

| Legacy Method | Legacy Endpoint                                                                                                                                                   | V4 Method | V4 Endpoint                                                                                                                                                            | Notes                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| GET           | `/v2/assets/{asset_id}/comments`  <br />([Get all the Comments and Replies from a Comment thread](https://developer.frame.io/api/reference/operation/getComments/)) | GET       | `/v4/accounts/{account_id}/files/{file_id}/comments`  <br />([List comments](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.index))    | Lists comments on a file.                                              |
| POST          | `/v2/assets/{asset_id}/comments`  <br />([Create a Comment](https://developer.frame.io/api/reference/operation/createComment/))                                     | POST      | `/v4/accounts/{account_id}/files/{asset_id}/comments`  <br />([Create comment](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.create)) | Create a comment. Body is similar: `{"text":"Nice","timestamp":12.3}`. |
| GET           | `/v2/comments/{comment_id}`  <br />([Get a Comment by ID](https://developer.frame.io/api/reference/operation/getComment/))                                          | GET       | `` `/v4/accounts/{account_id}/`comments/{comment_id} ``  <br />([Show comment](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.show))   | Fetch single comment by ID.                                            |
| PUT           | `/v2/comments/{comment_id}`  <br />([Update a Comment](https://developer.frame.io/api/reference/operation/updateComment/))                                          | PATCH     | `/v4/accounts/{account_id}/comments/{comment_id}`  <br />([Update comment)](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.update)     | Update text, time, etc.                                                |
| DELETE        | `/v2/comments/{comment_id}`  <br />([Delete a Comment](https://developer.frame.io/api/reference/operation/deleteComment/))                                          | DELETE    | `/v4/accounts/{account_id}/comments/{comment_id}`  <br />([Delete comment](https://developer.adobe.com/frameio/api/current/#tag/Comments/operation/comments.delete))     | Remove comment.                                                        |

 **7. Shares (Review Links / Presentations)**

In Frame V4 share links are no longer split between review and presentation links. In V4 the same link can now be configured with different styling to match the review or presentation experience.

|Legacy Method|Legacy Endpoint|V4 Method|V4 Endpoint|Notes|
|---|---|---|---|---|
|GET|`/v2/projects/{project_id}/review_links`  <br />([List Review Links in a project](https://developer.frame.io/api/reference/operation/reviewLinksList/))|GET|`/v4/accounts/{account_id}/projects/{project_id}/shares`  <br />([List shares](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.index))|Lists shares in a project|
|POST|`/v2/projects/{project_id}/review_links`  <br />([Create a Review Link)](https://developer.frame.io/api/reference/operation/reviewLinkCreate/)|POST|`/v4/accounts/{account_id}/projects/{project_id}/shares`  <br />([Create share](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.create))|Creates a new share link. Body might be `{"data":{"name":"Review Link","type":"review"}}`.|
|POST|`/v2/review_links/{link_id}/assets`  <br />([Add Asset to a Review Link](https://developer.frame.io/api/reference/operation/reviewLinkItemCreate/))|POST|`` `/v4/accounts/{account_id}/shares/`{share_id}/assets ``  <br />([Add new asset to share](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.add_asset))|Unclear if this supports files, folders, version stacks, etc - the API reference should be updated to clarify that|
|DELETE|Does not exist|DELETE|`` `/v4/accounts/{account_id}/shares/`{share_id}/assets/{asset_id} ``  <br />[(Delete Share)](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.remove_asset)|Remove asset from share|
|DELETE|`/v2/review_links/{link_id}`  <br />([Delete a Review Link](https://developer.frame.io/api/reference/operation/reviewLinkDelete/))|DELETE|`/v4/accounts/{account_id}/shares/{share_id}`  <br />[(Delete Share)](https://developer.adobe.com/frameio/api/experimental/#tag/Shares/operation/shares.delete)|Delete the share link.|
|PUT|`/v2/review_links/{review_link_id}`  <br />([Update a Review Link](https://developer.frame.io/api/reference/operation/reviewLinkUpdate/))|PATCH|`/v4/accounts/{account_id}/shares/{share_id}`  <br />[(Update Share)](https://developer.adobe.com/frameio/api/current/#tag/Shares/operation/shares.update)|Update the share link|

 **8. Webhooks**

Given the many changes to resources in [Frame.io](http://frame.io/) V4, and the experimental state of Webhooks for V4, the number of supported “events” that you trigger Webhooks off of is very different.

| Legacy Method | Legacy Endpoint                                                                                                               | V4 Method | V4 Endpoint                                                                                                                                                                    | Notes                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| POST          | `/v2/teams/{team_id}/hooks`  <br />[(Create Webhook)](https://developer.frame.io/api/reference/operation/createWebhookForTeam/) | POST      | `/v4/accounts/{account_id}/workspaces/{workspaces_id}/webhooks`  <br />[(Create Webhook)](https://developer.adobe.com/frameio/api/experimental/#tag/Webhooks/operation/webhooks.create) | Provide `{"data":{"url":"...","events":["file.created",...]}}`. |
| N/A           | N/A                                                                                                                           | GET       | `/v4/accounts/{account_id}/workspaces/{workspaces_id}/webhooks`  <br />[(Get List)](https://developer.adobe.com/frameio/api/experimental/#tag/Webhooks/operation/webhooks.index)        | Gets all webhooks for workspace                                 |
| GET           | `/v2/hooks/{hook_id}`  <br />[(Get Webhook)](https://developer.frame.io/api/reference/operation/getWebhook/)                    | GET       | `/v4/accounts/{account_id}/webhooks/{webhook_id}`  <br />[(Get Webhook)](https://developer.adobe.com/frameio/api/experimental/#tag/Folders/operation/folders.index)                     | Get webhook info                                                |
| PUT           | `/v2/hooks/{hook_id}`  <br />[(Update Webhook)](https://developer.frame.io/api/reference/operation/updateWebhook/)              | PATCH     | `/v4/accounts/{account_id}webhooks/{webhook_id}`  <br />[(Update Webhook)](https://developer.adobe.com/frameio/api/experimental/#tag/Webhooks/operation/webhooks.update)                | Update webhook settings                                         |
| DELETE        | `/v2/hooks/{hook_id}`  <br />[(Delete Webhook)](https://developer.frame.io/api/reference/operation/deleteWebhook/)              | DELETE    | `/v4/accounts/{account_id}/webhooks{webhook_id}`  <br />[(Delete Webhook)](https://developer.adobe.com/frameio/api/experimental/#tag/Webhooks/operation/webhooks.delete)                | Removes the webhook.                                            |

 **9. Custom Actions**

| Legacy Method | Legacy Endpoint | V4 Method | V4 Endpoint | Notes |
| ----- | ----- | ----- | ----- | ----- |
| POST | `/v2/teams/{team_id}/actions` ([Create a Custom Action](https://developer.frame.io/api/reference/operation/createActionForTeam/)) | POST | `/v4/accounts/{account_id}/workspaces/{workspace_id}/actions` ([Create Custom Action](https://developer.adobe.com/frameio/api/experimental/#tag/Custom-Actions/operation/actions.create)) | Create a custom action in a workspace. |
| DELETE | `/v2/actions/{action_id}` ([Delete a Custom Action](https://developer.frame.io/api/reference/operation/deleteAction/)) | DELETE | `/v4/accounts/{account_id}/actions/{action_id}` ([Delete Custom Action](https://developer.adobe.com/frameio/api/experimental/#tag/Custom-Actions/operation/actions.delete) | Delete a custom action. |
| PUT | `v2/actions/{action_id}` ([Update a Custom Action](https://developer.frame.io/api/reference/operation/updateAction/)) | PATCH | `/v4/accounts/{account_id}/actions/{action_id}` ([Update Custom Action](https://developer.adobe.com/frameio/api/experimental/#tag/Custom-Actions/operation/actions.update)) | Update custom action details. |
| GET | `/v2/teams/{team_id}/actions` ([Get Custom Actions for a Team)](https://developer.frame.io/api/reference/operation/getActionsByAccount/) | GET | GET  `/v4/accounts/{account_id}/workspaces/{workspace_id}/actions` ([List Custom Actions](https://developer.adobe.com/frameio/api/experimental/#tag/Custom-Actions/operation/actions.index)) | List Custom Actions in a given Workspace. |
| GET | `/v2/actions/{action_id}` ([Get a Custom Action by ID](https://developer.frame.io/api/reference/operation/getAction/)) | GET | `/v4/accounts/{account_id}/actions/{action_id}` ([Show Custom Action Details](https://developer.adobe.com/frameio/api/experimental/#tag/Custom-Actions/operation/actions.show)) | Show custom action details. |

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

## Error Handling

* **400** Bad Request: Check payload accuracy.
* **401** Unauthorized: Refresh or re-authenticate OAuth tokens.
* **403** Forbidden: Missing scope or user lacks access.
* **404** Not Found: Confirm endpoint, API version, or IDs.
* **422** Unprocessable Entity: Validate request data
* **429** Rate limited: Implement retry with backoff.
* **500** server error: Retry after a brief delay.

* * *
**Legacy API endpoints currently unavailable in V4 API:**

1. **Accounts & User Info**
    1. `GET /v2/accounts/{account_id}`
    2. `GET /v2/projects/shared`
    3. `GET /v2/accounts/{account_id}/membership`
2. Files & Folders
    1. `POST /v2/assets/{destination_folder}/move`
    2. `POST /v2/assets/{destination_folder}/copy`
    3. `DELETE /v2/assets/{asset_id}/unversion`
3. Teams / Workspaces
    1. `GET /v2/teams/{team_id}/membership`
4. Comments
    1. `GET /v2/comments/{comment_id}/impressions`
5. Shares
    1. `GET /v2/review_links/{link_id}`
6. Webhooks
    1. `GET /v2/accounts/{account_id}/webhooks`
7. Custom Actions
   1. `GET /v2/accounts/{account_id}/actions`

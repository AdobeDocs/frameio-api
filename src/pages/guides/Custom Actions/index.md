# Custom Actions Beta

Frame.io Actions provide quick access to common media operations like downloading, renaming, and duplicating items – and also allow for integrations with 3rd party tools and services to be surfaced directly within the user interface of [Frame.io](https://next.frame.io/).

## About Actions

With the introduction of custom Actions (beta), developers can configure and manage their own Actions in Frame.io V4. Leveraging the same underlying Event system as [Webhooks](https://developer.adobe.com/frameio/guides/Webhooks/), custom Actions are an alternative mechanism for developers to connect their assets to the tools that matter most to the users in their Frame.io Account.

Actions can be executed by any user that is a Member of the Frame.io Workspace the Action is enabled in. When executing an Action, Frame.io sends a payload to a URL you provide. The receiving application responds with an HTTP status code to acknowledge receipt, or with a custom callback to render additional form fields in the Frame.io UI. The receiving application can be your own hosted program, service, or even low-code/no-code IPaaS tool like Workfront Fusion or Zapier.
 
In this guide we'll walk you through everything you need to know for Configuring, Executing, and Deploying your own custom Actions.

## Actions Improvements in V4

Leveraging learnings from users of our Legacy version, we've included a number of enhancements to the Actions feature set in Frame.io V4:

– **New Field Types**: previously limited to text and single-select fields, we now support multi-select, text area (for a larger text box) and a boolean field (for a radio button) as well
– **Clickable Links**: text fields don't make it easy for users to copy/paste URLs. Use our new link field to get an easy, 1-click to copy experience instead
- **Dynamic Modals**: depending on the amount of data returned, you can trust your Action's modal to dynamically resize to best fit the information in your form, including scollable modals when needed

## Migrated Actions

There are a few things to keep in mind when migrating to a Frame.io V4 Account containing custom Actions previously created in the legacy version of Frame.io.

### Action Status

Upon Account migration to Frame.io V4, all custom Actions created in earlier versions will have a status of 'null' and will be automatically disabled. This provides users the opportunity to first update your Actions to use the V4 API before enabling as any Actions not updated will fail. To identify Actions in this state vist the Actions Settings page and reference the column "Status" or, if using the API, by checking the is_active field.

### Actionable Reources: Files, Folders & Version Stacks

Given the separation of asset types as separate resources in the Frame.io V4 API, there may be behavior to consider when interpreting the resource ID recieved in your Action's payload. The behavior for individual Files is straight-forward, as the ID will reflect the specific File the Action was executed on. Likewise for Folders, you'll be recieving the ID for the Folder the Action was executed on; however, depending on your use-case you have multiple options when defining your Action's behavior. Use the Folder ID to make subsequent calls to the Frame.io API if you want interact with the Folder resource itself. Alternatively, you may want to get the children of that Folder in order to perform further processing on the assets within. When an action is Executed on a Version Stack, your payload will contain the ID for the 'Head Asset', which is the top most File in the Stack and is what is shown in the Frame.io UI.

You can read more about the differences between the Frame.io Legacy API and V4 in our [Migration Guide](https://developer.adobe.com/frameio/guides/Migration/).

## Beta Feedback

We'd love to hear from developers and end-users about the ways you'd like to use Actions in Frame.io V4. Be sure to [reach out to us](https://forum.frame.io/) with your questions, ideas, and use-cases to help inform our prioritizaion.

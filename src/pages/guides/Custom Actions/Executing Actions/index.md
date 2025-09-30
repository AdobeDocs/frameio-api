# Executing Actions

Navigate to any File, Folder, or Version Stack and invoke the context menu by selecting the three dots (or right-clicking) and navigate to the sub-menu for custom Actions.

![Gif of Action Execution](../../image_18.gif)

Any active Actions configured for the Workspace you're in will be displayed. 

## Action Availiability

If there are no Actions enabled in your Workspace, this menu item will be hidden. Actions can be executed by any user that has Edit permissions to the Frame.io Workspace the Action is enabled in.

If you do have Actions available, simply select one to execute it. A unique `interaction_id` will be generated and included in the Action's payload which you can use to distinguish between independent executions of your Action by different users or at different times.

Depending on your Action's configuration, the user will be presented with a success message or a modal with form fileds to fill out before resubmitting.

Frame.io Actions also support error messaging in case your Action fails to execute, or if the URL provided is unreachable.

You can read more about interactions, forms, and all of the information needed for developing and debugging in the [Configuring Actions](../Configuring%20Actions/) guide.

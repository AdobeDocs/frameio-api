# DRAFT: May  2025 Changelog

* * *

## Webhooks `**Breaking Change**` Coming

Webhooks have been promoted from the alpha to the stable API version. The endpoint will be temporarily available in both APIs versions, before deprecating from alpha at the end of June.

To use webhooks  in the stable API version remove the `alpha` value in the `api-version` header of any webhook requests going forward.

The asset events are now split into folders and files.

* **New events**
    * **Files**
        * `file.created, file.deleted, file.ready, file.updated, file.upload.completed, file.versioned`
    * **Folders**
        * `folder.created, folder.deleted, folder.updated`
* **Old events**
    * `asset.created, asset.deleted, asset.ready, asset.updated, asset.upload.completed, asset.versioned`

## More Additions

**Custom Actions** Custom actions is part of limited beta. Anyone can create a custom action, but exposing it in the UI is only available to customers testing the feature. We plan to open the beta to all users in July 2025.

* Created endpoints for `creating`, `deleting`, `listing`, `showing`, and `updating` a custom action

**`Create File Local Upload`** This is a new endpoint specifically for uploading local files in the alpha API.

* Removes the requirement to include the media type in the parameter
* Returns upload URLs to initiate a multi-part upload for file

**`Create File Remote Upload`** This is a new endpoint specifically for uploading remote files, (i.e. files inaccessible via a publicly accessible URL) in the alpha API.

* Removes the need to include the file size and media type in the parameter

**`Show Files`** Added `media_links` parameters to allow specifying `media_links enums` in the alpha and stable API.
Options now include:

* High quality proxy (4K or 1080P)
* Efficient proxy (360P)

**`List folder children`** Added `media_links` parameters to allow specifying `media_links enums` in the alpha API when requesting a list of files.
Options now include:

* High quality proxy (4K or 1080P)
* Efficient proxy (360P)

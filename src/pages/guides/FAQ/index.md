# Frame.io API FAQ

The Frame.io API allows developers to integrate Frame.io’s surface for creatives and their teams to manage their work.

### Where is the **API reference**?

Go [here](https://developer-stage.adobe.com/frameio/api/current/) to see the Frame V4 API reference pages.

### How can I get **help**?

Reach out to the Frame.io support team for assistance by chatting with us on our [Support Site](https://help.frame.io/en/). Please note that enterprise customers may be directed to their Customer Success Manager.

### What are the **key concepts** to the Frame.io API?

* V4 represents an expansion from primarily serving post-production video professionals to a discipline-agnostic platform for creatives and creative managers. Frame.io acts as a central canvas for multi-disciplinary teams and solves for key needs for everything from more focus time for creative work to increased visibility into ongoing projects.
* **Workflow management**: Centralize, organize, and build all your end-to-end creative workflows at scale leveraging Metadata, Custom Fields, and Collections.
* **File transfer and management**: This set of capabilities gives users all the flexibility and power to build the best file management system for their creative process making it easier to quickly get the information they need, and manage all their work-in-progress assets at scale.
* **Review and approval**: Frame.io helps creative teams reduce the total number of revision cycles with advanced review, commenting, and annotation capabilities available across a broad set of media types.
* **Sharing and presentation**: Customize and share creative work from one central place.
* **Security and governance**: View and manage all users, workspaces, and projects in one place. Take bulk actions and export information to control how you utilize usage data.
* **Open API Standards**: A REST API and an OpenAPI specification connect Frame.io to the systems you already use to unblock custom workflows.

### Is the Frame.io V4 API **backward compatible**?  

No. The Frame.io product released at Adobe MAX operates in fundamentally different ways and emphasizes different workflows than the legacy version. Due to these differences, the new API is not backward compatible.

Recognizing that backward-compatibility is a major concern for customers managing production-quality integrations with high uptime requirements, we are designing the V4 API to support an additional level of versioning via a custom HTTP header in order to allow clients to opt into using experimental endpoints, avoid breaking changes, and provide backward-compatibility guarantees within the V4 namespace.

### Will the V4 API only be **available for enterprise**?

For the moment, Yes. Once the V4 API is generally available, will the automations I set up on V3 using Developer Tokens be broken, or will these be migrated to V4 automatically? Will I need to start my automations from scratch?

### Once the V4 API is generally available, will the **automations I set up on V3** using developer tokens be broken, or will these be migrated to V4 automatically?

All automations using v3 developer tokens will be broken and we **do not** have any way to migrate them to v4.

### Can we create and **manage Collections programmatically** on V4?

We do not yet have any Collections endpoints publicly available. But, Collections management is under development.

### Will there be a **Zapier** connection available for V4?

The existing Zapier integration however **does not work** with V4 yet but it is in development.

### Is there support or recommended workflows for integrating Frame.io V4 with Airtable, [Zapier](http://Zapier.com/), and [Make](http://Make.com/)?

No, not yet but it is in development.

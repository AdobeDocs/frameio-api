# Deploying Actions

There are muliple options for receiving applications depending on your requirements, budget, and use case.

When a custom Action is executed, a payload is sent from Frame.io to the URL provided in your Action's configuration. This URL represents the 'receiving application' for your Action.

The receiving application is what listens for the events emitted when your Action is executed and responds appropriately. It's where your Action's business logic, sometimes called a 'workflow' or 'scenario', is defined and maintained.

## No-Code Integration Platforms

Sometimes referred to as IPaaS, or Integration Platform as a Service, these are cloud-based data orchestration tools that offer a code-less GUI anyone can use to define a workflow. These platforms are a good choice when looking for a simple "click and create" experience to quickly connect your Frame.io assets with other popular apps and productivity tools already integrated with their platform. As IPaaS platforms usually require a subscription, cost-conscious customers will want to consider recurring payments and/or usage-based transcation fees when exploring these options.

### Zapier

A popular choice of customers who use legacy version of Frame.io, we're excited to continue our partnership with Zapier with the release of our [Frame.io V4 Zapier integration](https://zapier.com/apps/frameio-v4/integrations). Check out our new [Zapier Guide](https://developer.adobe.com/frameio/guides/Zapier/) for more information.

### Workfront Fusion

Existing Adobe customers may want to check their plan for existing access to Workfront Fusion, a powerful workflow automator that works especially well when orchastrating flows between products in the Adobe ecosystem. Developers can checkout [this tutorial](https://experienceleague.adobe.com/en/docs/platform-learn/tutorial-one-adobe/production/crpr2/ex5) specifically created for using Frame.io with Workfront Fusion.

### Make.com

Another popular tool loved by customers of the legacy version of Frame.io, use the [Frame.io V4 integration offered by Make](https://www.make.com/en/integrations/frame-io).

## Low-Code Serverless Applications

### Val Town

Val Town is a collaborative website to write and scale serverless JavaScript– and is a popular tool we use to demo the Frame.io Actions feature. Use it to quickly try out the new field types added in V4.

### AWS

Actions can be used with API Gateway in AWS to be further integrated with Amazon's [infamously large](https://aws.amazon.com/what-is-aws/) set of cloud services. The simplest pattern would be to proxy the Frame.io event defined in your Action to AWS Lambda, a compute service for running serverless functions.

### More Serverless Options

When you don't want to provision, manage, or scale servers, custom Actions can be deployed to any serverless compute service across popular cloud platforms such as Azure, Google Cloud Platform, and Digital Ocean.

## Bring Your Own Server

While the cloud services and IPaaS platforms listed above may be convenient and useful options for many, we recognize some customers want total control over their data and infrastructure. This option requires customers administer everything from networking to the application code itself, providing the most flexibility and control for enterprise and security-conscious customers.

Use the following documentation for information about the correct way to architect and build an OutSystems O11 application. In all cases, these are root level links and you may need to drill further into the menu of pages to find your answers:

1. Preliminary Getting Started Information: https://success.outsystems.com/documentation/11/getting_started/
2. Architecture: https://success.outsystems.com/documentation/11/app_architecture/
3. O11 Capabilities: https://success.outsystems.com/documentation/11/building_apps/
4. The OutSystems MCP: https://success.outsystems.com/documentation/11/outsystems_mcp/
5. More information about Service Modules: https://success.outsystems.com/documentation/11/building_apps/reusing_and_refactoring/use_services_to_expose_functionality/

I want you to read the current state of this project and fully understand the code as well as what it does. I then have two tasks for you:

First Task: Generate a report of the O11 modules that I will require including properly formatted names. This report should also include information about the planned contents of each module. Assume that FireBase will _not_ be used for the O11 application and that the data currently in FireStore will be represented in O11 Entities or Static Entities. No data conversion is required. This will be a green field application. Format the report using Markdown. Save this report to a file named "modules.md"

Second Task: Generate a report containing the distinct prompts that will be required for me to build the application using Claude Code with the OutSystems MCP. These prompts need to be complete and thorough, and limited to executing in a single module at a time. They also should be scoped appropriately to allow for human review between iterations, so if two large distinct tasks need to be performed in a modules, create two prompts in the correct order so the user can run the first prompt, analyze the results, make modifications, and then run the second prompt. Save this report to a file named "build.md"

Constraints:

- Do not change any code in the current application
- Do not connect to the OutSystems MCP to generate any code
- Prior to starting, acknowledge that you are able to use use the links I provided as grounding data when needed.
- If your acknowledgement is in the affirmative, I will direct you to proceed, otherwise I will adapt my instructions to you accordingly and we will try again
- At any time if you are unsure on a path forward do not make assumptions. Instead please ask.

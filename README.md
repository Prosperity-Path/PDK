# Prosperity Development Kit (PDK)

The PDK introduces a paradigm for creating value with software. 
It seeks to provide structure to allow software builders to focus on creating value, instead laboring on pieces that support delivering value like user auth systems.

At it's core, the PDK interfaces with a universally adaptable communication mechanism (like email, to start) and reduces the complexity for the developer into a series of messages that are contextually routed to functions. The goal is for the developer to only have to worry about receiving requests to functionally aligned REST endpoints.

The following diagram includes a visual representation of how the PDK works with a developer app.

![image](https://github.com/Prosperity-Path/PDK/assets/6632111/43cb2c64-edad-427b-b81d-ea6813107845)

You can see that the PDK abstracts away all the complexity of a modern application and allows the developer to focus on a simple set of functions aimed at value production. 

All communication is done via REST with the set of expected trigger endpoints, so the PDK is language agnostic.

The PDK is designed to be stateless and use a serverless function deployment approach.

Given the statelessness, the PDK stores all incoming and outgoing messages, so that an application can query the previous interchange and construct the necessary context it needs. Naturally, the app can use its own database, but the PDK has one included that's accessed through REST, as well. 

## Contributing
The PDK is an expressjs server with the necessary logic and utilities to abstract the non-value producing pieces of the development process away. So to contribute, you can submit a Pull Request describing the proposed improvement to the core server and accompanying utilities. If you don't feel comfortable with Javascript and/or expressjs, you can start building in a language you feel comfortable with and report any issues you find or open a discussion around the proposed improvement you have in mind. Please note that all contributions are welcome.

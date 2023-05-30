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

### Installing and Running Locally
The PDK needs node installed. If you don't have the LTS version of node installed, [NVM](https://github.com/nvm-sh/nvm) is a good option for
installation. You can install NVM with:
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```
and then to install node LTS
```
nvm install node # "node" is an alias for the latest version
```
#### Running the PDK
First, ensure you have the dependencies installed:
```
npm install
```
You can run the PDK with 
```
node kit.js
```
By default the PDK runs a node server on `localhost:3000` and looks for a companion app on `localhost:8080`

### Getting Started
The best place to get started with development using the PDK is the [Getting Started Guide](https://github.com/Prosperity-Path/PDK/wiki/Getting-Started-Guide), which uses a demo app to step through the core PDK evelopment flow.

### Docker
While there's a `Dockerfile` included in the repo, it's more provided for testing and a foundation for future work.
For local development, docker's networking layer prevents a docker-run PDK from reaching an app on `localhost:8080`. 


## Contributing
The PDK is an expressjs server with the necessary logic and utilities to abstract the non-value producing pieces of the development process away. So to contribute, you can submit a Pull Request describing the proposed improvement to the core server and accompanying utilities. If you don't feel comfortable with Javascript and/or expressjs, you can start building in a language you feel comfortable with and report any issues you find or open a discussion around the proposed improvement you have in mind. All contributions are welcome!

# Introduction

Workless is a framework for building efficient, scalable server-side applications on **Node.js**.

Workless uses progressive JavaScript, is built with and fully supports **TypeScript** (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Under the hood, Workless makes use of robust HTTP Server frameworks like **Express** (the default) and optionally can be configured to use **Fastify** as well!

Workless provides a level of abstraction above these common Node.js frameworks (Express/Fastify), but also exposes their APIs directly to the developer. This gives developers the freedom to use the myriad of third-party modules which are available for the underlying platform.

> **Hint** — Workless is built on top of NestJS patterns. If you're familiar with Angular or NestJS, you'll feel right at home.

## Philosophy

In recent years, thanks to Node.js, JavaScript has become the "lingua franca" of the web for both front and backend applications. This has given rise to awesome projects like **Angular**, **React** and **Vue**, which improve developer productivity and enable the creation of fast, testable, and extensible frontend applications. However, while plenty of superb libraries, helpers, and tools exist for Node (and server-side JavaScript), none of them effectively solve the main problem of — **Architecture**.

Workless provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by Angular.

## Installation

To get started, you can either scaffold the project with the Workless CLI, or clone a starter project (both will produce the same outcome).

To scaffold the project with the Workless CLI, run the following commands. This will create a new project directory, and populate the directory with the initial core Workless files and supporting modules, creating a conventional base structure for your project. Creating a new project with the **Workless CLI** is recommended for first-time users.

```bash
$ npm i -g @workless/cli
$ workless new project-name
```

> **Tip** — To create a new project with **TypeScript strict** mode enabled, pass the `--strict` flag to the `workless new` command.

## Alternatives

Alternatively, to install the TypeScript starter project with **Git**:

```bash
$ git clone https://github.com/zairosoft/workless-typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

> **Notice** — The JavaScript flavor of the starter project requires Node.js `v16` or higher.

Open your browser and navigate to [http://localhost:3000/](http://localhost:3000/).

You can also manually create a new project from scratch by installing the core and platform packages with **npm** (or **yarn**). In that case, of course, you'll be responsible for creating the project boilerplate files yourself.

```bash
$ npm i --save @workless/core @workless/common @workless/platform-express
```

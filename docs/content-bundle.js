// Auto-generated file. Do not edit directly.
window.DOCS_BUNDLE = {
  "registry": {
    "sections": [
      {
        "title": "Introduction",
        "items": [
          {
            "label": "Overview",
            "slug": "overview",
            "file": "content/overview.md"
          },
          {
            "label": "First steps",
            "slug": "first-steps",
            "file": "content/app/overview.md"
          }
        ]
      },
      {
        "title": "Components",
        "collapsed": true,
        "items": [
          {
            "label": "Overview",
            "slug": "component-overview",
            "file": "content/component/overview.md"
          }
        ]
      },
      {
        "title": "Database",
        "collapsed": true,
        "items": [
          {
            "label": "Overview",
            "slug": "database-overview",
            "file": "content/database/overview.md"
          }
        ]
      },
      {
        "title": "Modules",
        "badge": "NEW",
        "collapsed": true,
        "items": [
          {
            "label": "Overview",
            "slug": "module-overview",
            "file": "content/module/overview.md"
          }
        ]
      },
      {
        "title": "Deployment",
        "collapsed": true,
        "items": [
          {
            "label": "Docker",
            "slug": "docker",
            "file": "content/docker/overview.md"
          }
        ]
      }
    ]
  },
  "markdown": {
    "content/overview.md": "# Introduction\n\nWorkless is a framework for building efficient, scalable server-side applications on **Node.js**.\n\nWorkless uses progressive JavaScript, is built with and fully supports **TypeScript** (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).\n\nUnder the hood, Workless makes use of robust HTTP Server frameworks like **Express** (the default) and optionally can be configured to use **Fastify** as well!\n\nWorkless provides a level of abstraction above these common Node.js frameworks (Express/Fastify), but also exposes their APIs directly to the developer. This gives developers the freedom to use the myriad of third-party modules which are available for the underlying platform.\n\n> **Hint** — Workless is built on top of NestJS patterns. If you're familiar with Angular or NestJS, you'll feel right at home.\n\n## Philosophy\n\nIn recent years, thanks to Node.js, JavaScript has become the \"lingua franca\" of the web for both front and backend applications. This has given rise to awesome projects like **Angular**, **React** and **Vue**, which improve developer productivity and enable the creation of fast, testable, and extensible frontend applications. However, while plenty of superb libraries, helpers, and tools exist for Node (and server-side JavaScript), none of them effectively solve the main problem of — **Architecture**.\n\nWorkless provides an out-of-the-box application architecture which allows developers and teams to create highly testable, scalable, loosely coupled, and easily maintainable applications. The architecture is heavily inspired by Angular.\n\n## Installation\n\nTo get started, you can either scaffold the project with the Workless CLI, or clone a starter project (both will produce the same outcome).\n\nTo scaffold the project with the Workless CLI, run the following commands. This will create a new project directory, and populate the directory with the initial core Workless files and supporting modules, creating a conventional base structure for your project. Creating a new project with the **Workless CLI** is recommended for first-time users.\n\n```bash\n$ npm i -g @workless/cli\n$ workless new project-name\n```\n\n> **Tip** — To create a new project with **TypeScript strict** mode enabled, pass the `--strict` flag to the `workless new` command.\n\n## Alternatives\n\nAlternatively, to install the TypeScript starter project with **Git**:\n\n```bash\n$ git clone https://github.com/zairosoft/workless-typescript-starter.git project\n$ cd project\n$ npm install\n$ npm run start\n```\n\n> **Notice** — The JavaScript flavor of the starter project requires Node.js `v16` or higher.\n\nOpen your browser and navigate to [http://localhost:3000/](http://localhost:3000/).\n\nYou can also manually create a new project from scratch by installing the core and platform packages with **npm** (or **yarn**). In that case, of course, you'll be responsible for creating the project boilerplate files yourself.\n\n```bash\n$ npm i --save @workless/core @workless/common @workless/platform-express\n```\n",
    "content/app/overview.md": "",
    "content/component/overview.md": "",
    "content/database/overview.md": "",
    "content/module/overview.md": "",
    "content/docker/overview.md": ""
  }
};

![CI for server](https://github.com/florianwoelki/todover/actions/workflows/server.yml/badge.svg)

<br />
<p align="center">
  <a href="">
    <img src="assets/logo.png" alt="Logo" height="80">
  </a>

  <p align="center">
    Your Open Source todo managing application
    <br />
    <br />
    <a href="https://www.todover.com/">View Demo</a>
    ·
    <a href="https://github.com/FlorianWoelki/todover/issues/new?assignees=&labels=bug&template=bug_report.md&title=">Report Bug</a>
    ·
    <a href="https://github.com/FlorianWoelki/todover/issues/new?assignees=&labels=enhancement%2C+idea&template=feature_request.md&title=">Request Feature</a>
  </p>
</p>

## About The Project

**todover** is a fully open sourced version of a todo app. The todo app is free to use and you can use it on your daily basis to plan your day, week, month or year. Everything is just sweet and simple.

### Built With

todover is being built with the different technologies:
* TypeScript
* Frontend: TailwindCSS, Vue.js 3 and as a development server Vite
* Backend: Express, Apollo, GraphQL, and as a ORM Prisma

## Creating your own version

If you are scared of your data and because todover is an open source project, you can always create and install your own version of this application. Feel free to manipulate or redesign it. This project is based on the [MIT license](https://mit-license.org/).

### Installation

The first step of your custom installation is to clone the repository and install the dependencies.
```sh
$ git clone https://github.com/FlorianWoelki/todover.git
$ cd todover
$ yarn && yarn bootstrap
```

Now, there are two possibilities to deploy your version of the software.

You can use Docker for deployment or deploy it manually with build commands.

**Docker**

Using docker is especially easy because all services are containerized. For deploying and installing the frontend you can use the following to build and run the frontend image:
```sh
$ docker build -t todover-web -f Dockerfile.web .
$ docker run -p 3000:80 todover-web
```

With the help of running this container the frontend application will be available at `http://localhost:3000`.

The image of the frontend is also available [here](https://hub.docker.com/repository/docker/florianwoelki/todover-web).

Next, you can build the backend image and run the container via `docker-compose` because we need a postgres database.
```sh
$ cd /packages/server
$ docker-compose up --build
```

Now, you have a running GraphQL server on port `http://localhost:4000`.

If you just want a simple image of the todover backend, you can execute the following:
```sh
$ cd /packages/server
$ docker build -t todover-server .
```

The image of the backend is also available [here](https://hub.docker.com/repository/docker/florianwoelki/todover-server).

**Build Commands**

If you want to deploy your version of the software with commands, you can follow these steps.

Build the frontend:
```sh
$ cd /packages/web
$ yarn build
```

Build the server:
```sh
$ cd /packages/server
$ yarn build
```

You could also use lerna to build. This will execute the command `build` in every package:
```sh
$ cd /todover
$ yarn build
```

## Roadmap

You can find the official projects in the [projects page](https://github.com/FlorianWoelki/todover/projects).

If you want to participate and design the future of todover, feel free to [contribute](https://github.com/FlorianWoelki/todover/blob/main/.github/CONTRIBUTING.md)!

## Contribution & Pull Requests

If you want to contribute and create pull requests, make sure to read the [contribution guidelines](https://github.com/FlorianWoelki/todover/blob/main/.github/CONTRIBUTING.md).

Every help is appreciated!

### Setup environment

You can follow these steps to setup your local development. Make sure you have installed a postgres database with a valid database that you can use for development.

1. Clone the repository
```sh
$ git clone https://github.com/FlorianWoelki/todover.git
$ cd todover
```
2. Install all dependencies
```sh
$ yarn install
$ yarn bootstrap
```
3. Go into `/packages/server` and create a new `.env` file. Make sure that you copy and fill in all key value pairs of the `.env.example` file
4. Do the same with the `/packages/web` directory
5. Start the server and vite development server
```sh
$ cd /packages/server && yarn dev
$ cd /packages/web && yarn dev
```

### Want to help translating?

Understanding more than two languages can be challenging. Therefore, if you want to contribute by adding your tongue or fixing a translation issue, just follow this guide:

1. If you want to [clone the project](https://github.com/FlorianWoelki/todover/blob/main/.github/CONTRIBUTING.md), clone and fork it now (you can also do it directly on GitHub)
    1. Go to `packages/i18n/locales` and fix the translation issue in the corresponding file or
    2. Go to `packages/i18n/locales` and add your language file of the type `json` (you can use the other files as a template)
3. Commit and create a pull request for your translation
4. See your translation live on the page!

## License

[MIT](https://opensource.org/licenses/MIT)

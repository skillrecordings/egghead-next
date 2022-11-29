Welcome to the `egghead-next` project—the front-end for [egghead.io](https://egghead.io).

# Development

If you've already set up your local development environment, you can run:

`yarn dev`

# Setting Up Your Development Environment

To run this app locally for development, you'll need a few things. One of those is a working installation of [`egghead-rails`](https://github.com/eggheadio/egghead-rails) which provides the back-end functionality.

## 1. System-level stuff.

For the basic stuff like Homebrew, Node, Yarn, etc., run `bin/validate` to ensure you have the base requirements. It will help you install anything that's missing.

## 2. Vercel & Develoment Environment Variables

Before you cRun the following commands to connect the development environment to Vercel

`vercel login` will prompt you to login and verify
`vercel link` will ask you to choose the `eggheadio` organization and the `egghead-io-nextjs` project.
`vercel env pull` will bring in the development environment variables you need to get going.

## 3. `egghead-rails`

You'll need to walk through the [`egghead-rails`](https://github.com/eggheadio/egghead-rails) setup instructions. Once it's running, you should be able to start it by running the following from the project root:

`foreman start -f Procfile.dev`

## 4. Start Developing

To run `egghead-next` once `egghead-rails` is running, use:

`yarn install && yarn dev`

## 5. Handy Commands

View the `scripts` section of `package.json` for the primary development commands to run with `yarn`.

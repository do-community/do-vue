# Community Vue Resources

Custom Vue templates & resources for DigitalOcean Community tools.

---

## Development

To setup the develop environment, you will need to run `npm i` with Node 12+ installed.
This will install the dependencies to allow you to work the project.

We make use of `eslint` to maintain code quality in the JS & Vue files.
To run this you can use `npm test`.

## Usage Example

This package is being used in the [DigitalOcean Community DNS tools](https://github.com/do-community/dns-tool),
 which act as a great example of what templates and resources this package provides.

## Source Structure

### [`src/build`](./src/build)

This directory contains all the generic build scripts used in the Community tools.

### [`src/i18n`](./src/i18n)

This directory contains internationalisation data for all the Vue templates in this package.

### [`src/templates`](./src/templates)

This directory contains all the centralised Vue templates we use for the Community tools.
 
### [`src/utils`](./src/utils)

This directory contains any shared utility scripts used in this package or the Community tools.

## Contributing

If you are contributing, please read the [contributing file](CONTRIBUTING.md) before submitting your pull requests.

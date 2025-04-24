# crypto

App for exploring crypto world

## Prerequisites

- [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)
- Node.js v18.19.1 (LTS) - will be automatically installed using nvm
- npm v10+ (comes with Node.js)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/vbelolapotkov/crypto.git
   cd crypto
   ```

2. Set up the correct Node.js version:

   ```bash
   nvm install # installs Node.js version from .nvmrc
   nvm use    # switches to the project's Node.js version
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add necessary environment variables:
   ```bash
   cp .env.example .env
   ```

## Development

To run the application in development mode with hot-reload:

```bash
npm run dev
```

This will start the server using nodemon, which will automatically restart when file changes are detected.

## Scripts

- `npm run dev` - Start the development server with hot-reload
- `npm run build` - Build the TypeScript code
- `npm start` - Run the built application
- `npm run lint` - Run ESLint to check code style
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Building

To build the application:

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory.

To run the built application:

```bash
npm start
```

## Testing

The project uses Jest for testing. To run tests:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Code Style

The project uses:

- ESLint for code linting
- Prettier for code formatting

To check code style:

```bash
npm run lint
```

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

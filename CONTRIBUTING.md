# Contributing to BaseSignals

Thank you for your interest in contributing to BaseSignals! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/basesignals.git`
3. Install dependencies: `npm run install:all`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development

### Contracts

```bash
cd contracts
forge build
forge test
```

### Indexer

```bash
cd indexer
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Making Changes

1. Make your changes
2. Add tests if applicable
3. Ensure all tests pass
4. Update documentation if needed
5. Commit with clear messages

## Pull Request Process

1. Update README.md if needed
2. Update documentation if needed
3. Ensure all CI checks pass
4. Request review from maintainers

## Code Style

- Follow existing code style
- Use TypeScript for all new code
- Add comments for complex logic
- Write clear commit messages

## Questions?

Open an issue or reach out in discussions!


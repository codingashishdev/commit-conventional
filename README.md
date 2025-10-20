# conventional-committer

[![NPM version](https://img.shields.io/npm/v/conventional-committer.svg)](https://www.npmjs.com/package/conventional-committer)
[![License](https://img.shields.io/npm/l/conventional-committer.svg)](https://github.com/wanony/conventional-committer/blob/main/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A CLI tool for authoring Git commits that follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Features

- 🎯 **Interactive prompts** - Guided commit message creation
- 📋 **Conventional Commits compliance** - Follows the standard specification
- ✅ **Validation** - Ensures proper commit message format and length
- 🔍 **Staged changes detection** - Warns when no changes are staged
- 💥 **Breaking changes support** - Marks breaking changes with `!`
- 📝 **Optional detailed body** - Add comprehensive commit descriptions

## Installation

### Global Installation
```bash
npm install -g conventional-committer
```

### Local Installation
```bash
npm install --save-dev conventional-committer
```

## Usage

1. Stage your changes with `git add`
2. Run the tool:
   ```bash
   npx conventional-committer
   # or if installed globally
   conventional-committer
   ```
3. Follow the interactive prompts:
   - **Type**: Select from conventional commit types (feat, fix, docs, etc.)
   - **Scope**: Optional scope (e.g., auth, api, ui)
   - **Subject**: Short description (max 72 characters)
   - **Body**: Optional detailed description
   - **Breaking**: Mark if this is a breaking change
   - **Confirm**: Review and confirm the commit

## Showcase

![Conventional Committer Demo](https://via.placeholder.com/800x400.png?text=Conventional+Committer+In+Action)

## Commit Types

The tool supports all standard conventional commit types:

- `build` - Changes that affect the build system or external dependencies
- `chore` - Other changes that don't modify src or test files
- `ci` - Changes to CI configuration files and scripts
- `docs` - Documentation only changes
- `feat` - A new feature
- `fix` - A bug fix
- `perf` - A code change that improves performance
- `refactor` - A code change that neither fixes a bug nor adds a feature
- `style` - Changes that do not affect the meaning of the code
- `test` - Adding missing tests or correcting existing tests

## Example Output

```
feat(auth): add user authentication system

Implemented JWT-based authentication with login/logout functionality.
Added middleware for protected routes and token validation.

BREAKING CHANGE: Updated user schema, requires database migration.
```

## Development

### Build
```bash
npm run build
```

### Run locally
```bash
npm run start
```

## Requirements

- Node.js >= 14
- Git repository
- TypeScript (for development)

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Use this tool to create conventional commits!
5. Submit a pull request
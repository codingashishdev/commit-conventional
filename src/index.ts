import inquirer, { Answers } from "inquirer";
import { spawn, spawnSync } from "child_process";

const helpMessage = `
Usage: npx commit-conventional

Interactively create a conventional commit message.

Options:
  -h, --help    Show this help message.
`;

async function ensureStagedChanges() {
    const res = spawnSync("git", ["diff", "--cached", "--quiet"]);

    if (res.status == 0) {
        const { confirmProceed } = await inquirer.prompt<{
            confirmProceed: boolean;
        }>([
            {
                type: "confirm",
                name: "confirmProceed",
                message: "No staged changes detected. Commit anyway?",
                default: false,
            },
        ]);
        return confirmProceed;
    }

    return true;
}

function buildCommitMessage(a: Answers): string {
    const scopePart = a.scope ? `(${a.scope.trim()})` : "";
    const breaking = a.breaking ? "!" : "";
    const header = `${a.type}${scopePart}${breaking}: ${a.subject.trim()}`;

    const body = a.body ? a.body.trim() : "";
    const footer = a.breakingDescription ? `BREAKING CHANGE: ${a.breakingDescription.trim()}` : "";
    return [header, body, footer].filter(Boolean).join("\n\n");
}

async function main() {
    try {
        if (process.argv.includes("--help") || process.argv.includes("-h")) {
            console.log(helpMessage);
            process.exit(0);
        }

        const proceed = await ensureStagedChanges();
        if (!proceed) {
            console.log("Aborted: no staged changes.");
            process.exit(1);
        }

        const answers = await inquirer.prompt<Answers>([
            {
                type: "list",
                name: "type",
                message: "Type",
                choices: [
                    "build",
                    "chore",
                    "ci",
                    "docs",
                    "feat",
                    "fix",
                    "perf",
                    "refactor",
                    "style",
                    "test",
                ],
            },
            {
                type: "input",
                name: "scope",
                message: "Scope (optional)",
                filter: (v) => v.trim(),
            },
            {
                type: "input",
                name: "subject",
                message: "Short description (subject)",
                validate: (input: string) => {
                    const value = input.trim();
                    if (!value) return "Subject is required.";
                    if (value.endsWith(".")) return "No trailing period.";
                    if (value.length > 72) return "keep subject <= 72 characters";
                    return true;
                },
                filter: (v) => v.replace(/"/g, "'").trim(),
            },
            {
                type: "editor",
                name: "body",
                message: "Detailed body",
                when: async () => {
                    const { addBody } = await inquirer.prompt<{ addBody: boolean }>([
                        {
                            type: "confirm",
                            name: "addBody",
                            message: "Add detailed body?",
                            default: false,
                        },
                    ]);
                    return addBody;
                },
                filter: (v) => v.trim(),
            },
            {
                type: "confirm",
                name: "breaking",
                message: "Breaking change?",
                default: false,
            },
            {
                type: "input",
                name: "breakingDescription",
                message: "Breaking change description",
                when: (answers) => answers.breaking,
                validate: (input: string) => {
                    const value = input.trim();
                    if (!value) return "Breaking change description is required.";
                    return true;
                },
                filter: (v) => v.trim(),
            },
            {
                type: "confirm",
                name: "confirm",
                message: "Create commit?",
                default: true,
            },
        ]);

        if (answers.confirm == false) {
            console.log("Aborted by the user.");
            process.exit(1);
        }

        const message = buildCommitMessage(answers);

        const child = spawn("git", ["commit", "-m", message]);

        child.on("close", (code) => {
            if (code == 0) {
                console.log("Commit created successfully.");
            } else {
                console.log(`git commit exited with code ${code}`);
            }
        });
    } catch (err: any) {
        if (err?.isTtyError) {
            console.log("Interactive prompt not supported in this environment");
        } else {
            console.log("Something went wrong", err?.message || err);
        }
        process.exit(1);
    }
}

main();

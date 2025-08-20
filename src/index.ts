import inquirer, { Answers } from 'inquirer';
import { spawn, spawnSync } from 'child_process';

async function ensureStagedChanges() {
    const res = spawnSync('git', ['diff', '--cached', '--quiet']);

    if (res.status == 0) {
        const { confirmProceed } = await inquirer.prompt<{ confirmProceed: boolean }>([
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
    const scopePart = a.scope ? `(${a.scope.trim()})` : '';
    const breaking = a.breaking ? '!' : '';
    const header = `${a.type}${scopePart}${breaking}: ${a.subject.trim()}`;

    const body = a.body ? a.body.trim() : "";
    return [header, body].filter(Boolean).join('\n\n');
}

async function main() {
    try {
        const proceed = await ensureStagedChanges();
        if (!proceed) {
            console.log('Aborted: no staged changes.');
            process.exit(1);
        }
    
        const answers = await inquirer.prompt<Answers>([
            {
                type: 'list',
                name: 'type',
                message: 'Type',
                choices: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'style', 'test']
            },
            {
                type: 'input',
                name: 'scope',
                message: 'Scope (optional)',
                filter: (v) => v.trim(),
            },
            {
                type: 'input',
                name: 'subject',
                message: 'Shorted description (subject)',
                validate: (input: string) => {
                    const value = input.trim();
                    if (!value) return 'Subject is required.';
                    if (value.endsWith('.')) return 'No trailing period.'
                    if (value.length > 72) return 'keep subject <= 72 characters'
                    return true;
                },
                filter: (v) => v.replace(/"/g, "'").trim(),
            },
            {
                type: 'editor',
                name: 'body',
                message: 'Detailed body',
                when: async () => {
                    const { addBody } = await inquirer.prompt<{ addBody: boolean }>([
                        {
                            type: 'confirm',
                            name: 'addBody',
                            message: 'Added detailed body?',
                            default: false
                        },
                    ]);
                    return addBody;
                },
                filter: (v) => v.trim(),
            },
            {
                type: 'confirm',
                name: 'breaking',
                message: 'Breaking change?',
                default: false,
            },
            {
                type: 'confirm',
                name: 'confirm',
                message: 'Create commit with above information?',
                default: true,
            },
        ]);
    
        if(answers.confirm == false){
            console.log('Abored by the user. ');
            process.exit(1);
        }
    
        const message = buildCommitMessage(answers);
    
        const child = spawn('git', ['commit', '-m', message]);
    
        child.on('close', (code) => {
            if(code == 0){
                console.log('Commit created. ');
            }
            else{
                console.log(`git commit exited with code ${code}`)
            }
        });
    } catch (err: any) {
        if(err?.isTtyError){
            console.log("interative prompt not supported in this environment")
        }
        else{
            console.log('Something went wrong', err?.message || err);
        }
        process.exit(1);
    }
}

main()
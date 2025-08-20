import inquirer from 'inquirer';
import { exec } from 'child_process';

inquirer
    .prompt([
        {
            type: 'list',
            name: 'types',
            message: 'Common Types',
            choices: ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'],
        },
        {
            type: 'input',
            name: 'description',
            message: 'Commit description',
        },
    ])
    .then((answers: { types: string; description: string }) => {
        console.log(`User selected type: ${answers.types}`);
        console.log(`User description: ${answers.description}`);
        if (answers.description && answers.description.trim() !== '') {
            const commitMessage = `git commit -m "${answers.types} : ${answers.description.trim()}"`
            exec(commitMessage, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing command: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Command error output: ${stderr}`);
                    return;
                }
                console.log(`Command output: ${stdout}`);
            });
        } else {
            console.log("Put valid inputs")
        }
    })
    .catch((error) => {
        if ((error as any).isTtyError) {
            console.log(error)
        } else {
            console.log("Something went wrong! Unknown ERROR")
        }
    });
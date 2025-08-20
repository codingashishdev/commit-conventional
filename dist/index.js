"use strict";
//1. prompt the user
//2. test against the conventional commit message format
//3. if the message is valid, proceed with the commit
//4. if the message is invalid, prompt the user to enter a valid message
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const child_process_1 = require("child_process");
inquirer_1.default
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
    .then((answers) => {
    console.log(`User selected type: ${answers.types}`);
    console.log(`User description: ${answers.description}`);
    if (answers.description && answers.description.trim() !== '') {
        const commitMessage = `git commit -m "${answers.types} : ${answers.description.trim()}"`;
        (0, child_process_1.exec)(commitMessage, (error, stdout, stderr) => {
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
    }
    else {
        console.log("Put valid inputs");
    }
})
    .catch((error) => {
    if (error.isTtyError) {
        console.log(error);
    }
    else {
        console.log("Something went wrong! Unknown ERROR");
    }
});

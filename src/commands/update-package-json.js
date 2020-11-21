const run = require("../index");
const { exec } = require("child_process");

async function main() {
    const outputs = {};
    const tkCore = {
        info: console.log,
        setOutput: (name, value) => {
            outputs[name] = value;
        }
    };
    const tkExec = {
        exec: (command, args, opts) => {
            return new Promise((resolve, reject) => {
                exec([command, ...args].join(" "), (error, stdout, stderr) => {
                    if (error) {
                        reject(error);
                    } else {
                        if (opts.listeners) {
                            if (opts.listeners.stdout) {
                                opts.listeners.stdout(
                                    Buffer.from(stdout, "utf8")
                                );
                            }
                            if (opts.listeners.stderr) {
                                opts.listeners.stderr(
                                    Buffer.from(stderr, "utf8")
                                );
                            }
                        }
                        resolve();
                    }
                });
            });
        }
    };
    try {
        await run({ core: tkCore, exec: tkExec });
        console.log(outputs);
    } catch (error) {
        console.error(error);
        process.exitCode = 1;
    }
}

module.exports = main;

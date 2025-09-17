const fs = require('fs');
const path = require('path');

export function view_rpc_config() {
    const configPath = path.join(process.cwd(), 'vx.config.json');

    try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        //return JSON.parse(configContent);
        const parsedContent = JSON.parse(configContent);
        console.log(`RPC : ${parsedContent.protocol}://${parsedContent.host}:${parsedContent.port}`);
        process.exit(0);
    } catch (error) {
        console.error(`Error reading vx.config.json: ${error.message}`);
        process.exit(1);
    }
}

export function load_rpc_config(rpcPath) {

    const configPath = path.join(process.cwd(), rpcPath || 'vx.config.json');

    
    try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        //return JSON.parse(configContent);
        const parsedContent = JSON.parse(configContent);
        return parsedContent; // Return the first configuration object
    } catch (error) {
        console.error(`Error reading vx.config.json: ${error.message}`);
        process.exit(1);
    }
}
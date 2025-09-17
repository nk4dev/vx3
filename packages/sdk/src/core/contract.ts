import { load_rpc_config } from "./rpc/connect";

function intstance(configPath: string) {
  const config = load_rpc_config(configPath);
  const parsedContent = JSON.parse(config);

  const rpcUrl = `${parsedContent.protocol}://${parsedContent.host}:${parsedContent.port}`;
  if (!config) {
    console.error("No configuration found. Please run 'vx rpc init' to create a configuration.");
    process.exit(1);
  }
  console.log(rpcUrl);
  return { config, rpcUrl };
}

export function getRpcUrl() {
  const config = load_rpc_config(null);
  try {
    return `${config.protocol}://${config.host}:${config.port}`;
  } catch (error) {
    console.error(`Error reading vx.config.json: ${error.message}`);
    process.exit(1);
  }
}

export function getRpcUrlWithPath(configPath?: string) {
  const config = load_rpc_config(configPath || null);
  try {
    return `${config.protocol}://${config.host}:${config.port}`;
  } catch (error) {
    console.error(`Error reading vx.config.json: ${error.message}`);
    process.exit(1);
  }
}

export default intstance;

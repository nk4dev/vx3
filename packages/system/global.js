import pjson from '../../package.json';

// api endpoint for global use
export const GLOBAL_API_URL=process.env.API_SERVER || 'https://api.varius.technology/';

/*
api endpoint
docs: 
https://vx.varius.technology/api/endpoints
*/

export const API_URLS = {
    gasPrice: `${GLOBAL_API_URL}/gasprice`,
    blockNumber: `${GLOBAL_API_URL}/blocknumber`,
    balance: `${GLOBAL_API_URL}/balance`,
    tx: `${GLOBAL_API_URL}/tx`,
    txs: `${GLOBAL_API_URL}/txs`,
};

export const VERSION = pjson.version;
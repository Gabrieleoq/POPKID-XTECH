const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaUw4V1JnVVU4SUJNWUZsS3lJTVZMOHFCMWMwVC96MkdFdzI1SnBvTVFWdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0l4anpGK2U4bEMvZG82VWQvbmU1U0VlTVgxY05ta2pVTmRpSWF0M3l6cz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNSVpqV3VraWRucmltcnNZR0tyekxJOG1JNVNBM2VRcEp4ZTBWQ2RzbWtZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJEbjBrdW83ZUt6RjFWdE93N0twRDdtcDVWSlNhUTdjRHJIS0QzWFc0dm1ZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImtDUjgvWnRKZnQ3V3h3WmRlK0VndDRMeVJOdE9LVXN4dm1zVkpGQUVVMmM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iks1ZFN0Vm04a0NvNWJseEViUExyaER2OG1WU09XeGZVdU1KdTFzWFZ6R0E9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiS0p3ZmpPMDY1Wndod1AzdEpjR2loem5MS2loNWZFQjA3QnFiMnR3aHJGWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZFBWSWVVU05SbHIrWXg0K1lJQTh5RUVxZnd3dlh2cDlhUW1kVzM3WkJ6OD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVZNk9hazEvUzBNMS95dVljNDdtdlRWSDRVR3lCT2F5THNod0FSbkQzeW9kUDVzaUZZN3ZRNC81cEJQcXY4RlI1czE4MjFUZCs4YkhjK2h4YW1MRGpRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTg3LCJhZHZTZWNyZXRLZXkiOiJkSEl1aU9lRlA1ZHBoNlBQaTVpOGJoN3k3WERPeVVLNHVibG50eVFiaFhRPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzIsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMiwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJlb2x1cy13Z1RRLUJDMzIxeDNNQTdnIiwicGhvbmVJZCI6IjEzNjMyZDBkLWIwMmItNDA2Yi1iZWI5LTFiYzI4YzMwYWU5NyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIvRHN2dGJtZXRwRjYzQnFiM0JuK0k1V1Z0NzA9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibnFHUGh0MHZkZ1ZMRmUxVEt2R21MRWdqS3h3PSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkdCQlFYUTRYIiwibWUiOnsiaWQiOiI0MDc3MTA0ODE4NTo2M0BzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDSTJYOE5BR0VObkg0TDBHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiWUV1ZEFOY1psT1EycUh6Ry9LZFZnUytDS0dNVVl0SWpyeFgyaUFNOW94WT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNjJYWXl6eTgwNy9aQ2diQ1VrQUh3bHJsekZoaDJ1OUp1MUptQ2tCMmpNMm1iQW5kTkEwTHVvTWY0d3RBc1FPMXRZZGtNNGJ4WXBYd21GeHZxdzI3Q3c9PSIsImRldmljZVNpZ25hdHVyZSI6ImtuMldQQlVHamlpc3lpMDFyc0N3bjVmNkdrMUUzMkhIQ1V5Yk9WZXNjZHRpcENJVWVGV2ZXQ0JObmRKTUV1UkpCdzlUc1JUYUpPMzNNek83RUJob2pBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiNDA3NzEwNDgxODU6NjNAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCV0JMblFEWEdaVGtOcWg4eHZ5blZZRXZnaWhqRkdMU0k2OFY5b2dEUGFNVyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc0MDEyMTA2N30=',
    PREFIXE: process.env.PREFIX || "+",
    CHAT_BOT : process.env.CHAT_BOT|| "non",
    OWNER_NAME : process.env.OWNER_NAME || "Popkid Tech",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "254732297194",
    ANTICALL: process.env.ANTICALL || "non",
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || "non",
    AUTO_BIO: process.env.AUTO_BIO || "non",
    ANTIDELETEDM: process.env.ANTIDELETEDM|| "non", 
    ANTIVV: process.env.ANTIVV|| "non", 
    ADMGROUP: process.env.ADMGROUP || "non", 
    AUTO_SAVE_CONTACTS: process.env.AUTO_SAVE_CONTACTS || "non", 
    AUTO_REPLY: process.env.AUTO_REPLY || "non",              
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTOREAD_MESSAGES: process.env.AUTOREAD_MESSAGES || "non",
    AUTO_REACT: process.env.AUTO_REACTION || "non",
    ANTILINK :process.env.ANTILINK || "non", 
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F",
    CAPTION : process.env.CAPTION || "ᴘᴏᴡᴇʀᴇᴅ ʙʏ Popkid-MD",
    BOT : process.env.BOT_NAME || 'BELTAH-MD',
    URL : process.env.BOT_MENU_LINKS || '',
    MODE: process.env.PUBLIC_MODE || "no",
    TIMEZONE: process.env.TIMEZONE || "Africa/Nairobi", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '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',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    CHATBOT : process.env.PM_CHATBOT || 'no',  
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, {
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: true,
    API_URL: 'http://api-app.fetest.scayla.com',
    API_AUTH_URL: 'http://api-auth.fetest.scayla.com',
    API_UPLOAD_URL: 'http://api-mq.fetest.scayla.com:8081',
    DOMAIN_NAME: '.dev.scayla.com'
};

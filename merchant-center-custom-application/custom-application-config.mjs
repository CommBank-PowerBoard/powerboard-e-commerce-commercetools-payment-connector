const config = {
    name: 'powerboard-m-app',
    entryPointUriPath: '${env:ENTRY_POINT_URI_PATH}',
    cloudIdentifier: '${env:CLOUD_IDENTIFIER}',
    env: {
        development: {
            initialProjectKey: '${env:APP_PROJECT_KEY}',
        },
        production: {
            applicationId: '${env:CUSTOM_APPLICATION_ID}',
            url: '${env:APPLICATION_URL}',
        },
    },

    additionalEnv: {
        clientId: '${env:APP_CLIENT_ID}',
        clientSecret: '${env:APP_CLIENT_SECRET}',
        projectKey: '${env:APP_PROJECT_KEY}',
        region: '${env:APP_REGION}',
        sandboxApiURL: '${env:SANDBOX_API_URL}'
    },
    oAuthScopes: {
        view: [],
        manage: [],
    },
    icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
    mainMenuLink: {
        defaultLabel: 'Powerboard Settings',
        uriPath: '${env:CLOUD_IDENTIFIER}',
        labelAllLocales: [
            { locale: 'en',  value: 'Powerboard Settings'},
            { locale: 'de',  value: 'Powerboard Settings'}
        ],
        permissions: [],
    },
    submenuLinks: [
        {
            uriPath: 'liveconnection',
            defaultLabel: 'Live Connection',
            labelAllLocales: [
                { locale: 'en', value: 'Live Connection' },
                { locale: 'de', value: 'Live Connection' }
            ],
            permissions: [],
        },
        {
            uriPath: 'widgetconfiguration',
            defaultLabel: 'Widget Configuration',
            labelAllLocales: [
                { locale: 'en',  value: 'Widget Configuration' },
                { locale: 'de', value: 'Widget Configuration' }
            ],
            permissions: [],
        },
        {
            uriPath: 'sandboxconnection',
            defaultLabel: 'Sandbox Connection',
            labelAllLocales: [
                { locale: 'en',  value: 'Sandbox Connection' },
                { locale: 'de',  value: 'Sandbox Connection' }
            ],
            permissions: [],
        },
        {
            uriPath: 'log',
            defaultLabel: 'Log',
            labelAllLocales: [
                { locale: 'en',  value: 'Log' },
                { locale: 'de',  value: 'Log' }
            ],
            permissions: [],
        },
        {
            uriPath: 'orders',
            defaultLabel: 'Orders',
            labelAllLocales: [
                { locale: 'en',  value: 'Orders' },
                { locale: 'de',  value: 'Orders' }
            ],
            permissions: [],
        },
    ],
    headers: {
        csp: {
            'connect-src': [
                '\'self\'',
                `https://auth.${process.env.APP_REGION}.commercetools.com`,
                `https://auth.${process.env.APP_REGION}.commercetools.com/oauth/token`,
                `https://api.${process.env.APP_REGION}.commercetools.com`,
                '${env:APPLICATION_URL}',
                'https://api.powerboard.commbank.com.au',
                'https://api.preproduction.powerboard.commbank.com.au',
                'https://api.staging.powerboard.commbank.com.au'
            ],
            'script-src': [
                '\'self\'',
                '\'unsafe-inline\'',
                '\'unsafe-eval\'',
                `https://auth.${process.env.APP_REGION}.commercetools.com`,
                `https://auth.${process.env.APP_REGION}.commercetools.com/oauth/token`,
                `https://api.${process.env.APP_REGION}.commercetools.com`,
                '${env:APPLICATION_URL}',
                'https://api.powerboard.commbank.com.au',
                'https://api.preproduction.powerboard.commbank.com.au',
                'https://api.staging.powerboard.commbank.com.au'
            ],
            'style-src': [
                '\'self\'',
                '\'unsafe-inline\'',
                'https://fonts.googleapis.com'
            ],
            'img-src': [
                '\'self\'',
                'data:',
                'https:'
            ],
            'font-src': [
                '\'self\'',
                'https://fonts.gstatic.com'
            ],
            'frame-src': [
                '\'self\'',
                `https://auth.${process.env.APP_REGION}.commercetools.com`,
                `https://auth.${process.env.APP_REGION}.commercetools.com/oauth/token`,
                `https://api.${process.env.APP_REGION}.commercetools.com`,
                '${env:APPLICATION_URL}',
                'https://api.powerboard.commbank.com.au',
                'https://api.preproduction.powerboard.commbank.com.au',
                'https://api.staging.powerboard.commbank.com.au'
            ],
        },
    },
};

export default config;
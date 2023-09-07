# The Missing Document

## Debugging in local environment

Outbox-UI communicates to a bunch of external APIs. These APIs are initially designed
for M2M calls, and distinct in levels of tolerancy to requests from browsers, especially
when ORIGIN of a request is local*.

Initial browser plugin workaround for the issue has been shut down by policy. Proxying these
request on outbox server is impossible, as not all APIs support on-behalf-of requests.

To facilitate the issue, outbox-ui now utilizes highly-customized local proxy to issue API requests.
See proxy.config.js for customization details. `npm run start` command runs debug session
with proxy on local environment. In order for the proxy to operate, it needs to acquire Bearer
token. To facititate token acqusition, create a file .auth on the project folder with one line
of the following content:

YOUR_KID:YOUR_PASSWORD

Beware not to commit this file! .gitignore in the project is set to ignore the file.

Alternatively
To get the token save the script

```bash
    echo '** Local proxy authentication **'
    read -p 'KID:' ISSO_USER
    read -sp 'password:' ISSO_PASS
    FIP_URL=https://isso-devint.fip.dev.finra.org/fip/rest/isso/oauth2/access_token?grant_type=client_credentials
    export BEARER=`curl --user "${ISSO_USER}:${ISSO_PASS}" -X POST --silent ${FIP_URL} | jq -r .access_token`
    unset ISSO_USER ISSO_PASS
```

to the file `getbearer`, and execute it in current shell with the command

```bash
    . getbearer
```

before starting debug session.

## Debugging in vscode

While Chrome F12 debug console serves major needs, it is more convenient to debug directly in vscode to
unify code editing and debugging in the same window.

### Setting vsode debug sesson

- Edit launch.json via vscode -> Run-> Add Configuration. Add the folloiwng element to "configurations" array of the launch.json

```json
    {
        "name": "attach to browser:9222",
        "type": "chrome",
        "request": "attach",
        "port": 9222
    }
```

- Configure to run Chrome in debug mode. Shortcut command is below.

  "C:\Program Files\Google\Chrome\Application\chrome.exe" --disable-web-security --disable-gpu  --remote-debugging-port=9222 --user-data-dir=c:/chrometemp <https://docgen-dev.ccm.dev.finra.org/outbox-api/swagger/swagger-ui/>

  - The parameters --disable-web-security --disable-gpu --user-data-dir=c:/chrometemp are optional.
  - Beware to create the folder c:/chrometemp
  - Navigating to start page (docgen-dev...) is needed for Chrome to collect authentication artifacts.
  - If local proxy  points to qa (proxy.config.js SDLC='qa'), not dev API, the docgen URL has to be changed to qa API.  

### Starting vscode debug session

- start Chrome with the above shortcut
- npm run start
- vscode -> run -> start debugging
- navigate chrome to <https://local.dev.finra.org:4200/>
- step through, beakpoints, inspection, stack trace, debug console are available in vscode.
- HTML inspect, network log are only in Chrome.  

## Debug options in cloud deployments

Outbox-UI is a Web Component. It is intented to operate as a part of another (host) application.
To support standalone development/testing/troubleshooting in cloud deployment several test harnesses
have been created.

- <https://docgen-dev.ccm.finra.org/outboox-ui/>      - test harness in non-web-component/minified mode
- <https://docgen-dev.ccm.finra.org/outboox-ui/debug> - test harness in non-web-component/non-minified mode
- <https://docgen-dev.ccm.finra.org/outboox-ui/web-components/> - test harness in web-component/minified mode
- <https://docgen-dev.ccm.finra.org/outboox-ui/web-components/index-debug.html> - test harness in web-component/non-minified mode
- <https://docgen-dev.ccm.finra.org/outboox-ui/web-components/outbox-web-components.js> - web-component/minified mode
- <https://docgen-dev.ccm.finra.org/outboox-ui/web-components/outbox-web-components-debug.js> - web-component/non-minified mode

## Unit tests in vscode

Install two vscode extensions

- Test Explorer UI
- Karma Test Explorer (for Angular, Jasmine, and Mocha)

... restart vscode, and select 'Test' button at the left edge

## How this was generated

```bash
    ng new outbox-ui --create-application=false
    ng generate application TestWebComponent --skip-install=true
    ng generate component Composer
```

- Modify app.module.ts to the following:

```typescript
        import { NgModule, DoBootstrap, Injector } from '@angular/core';
        import { BrowserModule } from '@angular/platform-browser';
        import { createCustomElement } from '@angular/elements';

        import { ComposerComponent } from './composer/composer.component';

        @NgModule({
        declarations: [ComposerComponent],
        imports: [BrowserModule],
        providers: [],
        bootstrap: []
        })
        export class AppModule implements DoBootstrap {

        constructor(private injector: Injector) {
            const webComponent = createCustomElement(ComposerComponent, {injector});
            customElements.define('composer-component', webComponent);
        }

        ngDoBootstrap() {}
        }
```

- Modify index.html body to:

```html
    <body><composer-component></composer-component></body>
```

- Remove app.component.*

## OutboxUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

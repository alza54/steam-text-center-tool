# Steam Text Center Tool by shellcode.team
A tool which automatically centers text for your Steam profile.

:sparkling_heart: User-friendly interface

:sparkles: Editor can be used not only for centering text, because it is handy

:collision: Two symbols used for text centering

:watch: Text centering precision displayed per line

:raised_hands: Multiple centering modes

:rat: Vue.js, Sass, Webpack & Koa, Nightmare.js

:u5272: Language translations

## Install

`git clone https://github.com/alza54/steam-text-center-tool.git`

`npm install` or `yarn`

if you are using yarn & meet this error:

```bash
error upath@1.0.4: The engine "node" is incompatible with this module. Expected version ">=4 <=9".
```

please use

```
yarn --ignore-engines
```

After that, create a `.env` file and set the port, proxy URL, proxy login and password:

```env
# Koa is listening on this port
PORT=8889
# Proxy for Nightmare.js to not expose server IP when for example images are passed
PROXYURL=192.168.1.1:1337
PROXYLOGIN=alza54
PROXYPASS=pass
```

### Run

> Node.js support. **You need to create a `.env` file as above**.

### Node.js

Beacuse of using Koa2, `Node.js >= v7.6.0` is needed.

#### Development (front-end, no API):

`npm run dev` && `npm run server`

open browser: `localhost:8080`

#### Production:

`npm run start`

open browser: `localhost:8889`

- [x] Prepare polish locales
- [ ] Prepare english locales
- [ ] Prepare german locales
- [ ] Prepare russian locales

# Walk away ddocs
This repo contains the code to independently recover all documents tied to your account using your backed up keys in case the main [dDocs app](https://ddocs.new/) is down

## Prerequiste

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fileverse/walk-away-ddocs.git

   ```

2. **Install it dependencies:**

   ```bash
   npm install
   ```

## Configure Environment Variables

Copy the `.env.example` file to `.env` in the root directory:

```bash
cp .env.example .env
```
Update with config values

## Run the App

Start the development server:

```bash
  npm run dev
```

## Dependencies
- [Viem](https://viem.sh/docs/getting-started)
- [Tweetnacl](https://tweetnacl.js.org/#/)
- [js-base64](https://www.jsdocs.io/package/js-base64)
- [Penumbra](https://github.com/transcend-io/penumbra)

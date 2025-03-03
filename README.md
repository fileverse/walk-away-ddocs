# Walk away ddocs
This repo contains the code to independently recover all documents tied to your dDocs account using your back up key, in case the main [dDocs app](https://ddocs.new/) is down. Easily control your documents end-to-end without depending on centralized servers 💛

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



## Overview of the Backup Keys
Your portal keys consist of :
- **Portal Address** – The contract address that manages your files on ddocs
- **Owner Public Key** -  An RSA-generated public key used by the portal owner to encrypt their ddoc file data.
- **Owner Private Key** - An RSA-generated private key used by the portal owner to decrypt their ddoc file data.
- **Portal Public Key** - An RSA-generated public key used by portal collaborators to encrypt ddoc file data.
- **Portal Private Key** - An RSA-generated private key used by the  collaborators to decrypt their ddoc file data.
- **Member Public Key** - An RSA-generated public key used by portal members to encrypt their ddoc file data.
- **Member Private Key** -  An RSA-generated private key used by portal members to decrypt their ddoc file data.

## How are files linked to a portal ?
Files are linked to a portal by the portal address and the fileID.

## How is a file encrypted?
Files are encrypted using an AES key, which is generated by encrypting the file through Penumbra. This AES key is then further encrypted to create different access locks:
- **Portal Lock** – Created by encrypting the file key with the portal public key.
- **Owner Lock** – Created by encrypting the file key with the owner's encryption key.
- **Link Lock** - Created by encrypting the file key with a link key. Link keys are unique, randomly generated AES keys for each file, which are stored in an encrypted format using the owner’s public key. They are are used for sharing files via a link.


## How is a file decrypted?
Files can be decrypted using any of the available locks:
- **Portal Lock** – Contains the encrypted file key, which is decrypted using the portal private key
- **Owner Lock** – Contains the encrypted file key, which is decrypted using the owner's private key.
- **Link Lock** – Contains the encrypted file key, which is decrypted using the link key.

You can refer [here](https://github.com/fileverse/walk-away-ddocs/blob/c37548d4b5b380b3597ee7e336e19cf3aec10531/src/components/retrieve-section.jsx#L42)

## How are comments linked to a file ?
Comments are linked to a file by the ddoc’s portal address and ddocId.

## How is a Comment Encrypted?
A comment and its associated data are encrypted using a random AES key that is unique to each ddoc file. This AES key is then encrypted using the portal key, owner key, and link key to ensure secure access and controlled decryption.


## How is a Comment Decrypted?
A comment and its data are decrypted using the comment key, which is retrieved from the owner, portal, or link locks. The corresponding lock is decrypted using its associated key.

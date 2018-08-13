<hr />
<div align="center">
    <img src="images/nix_full.png" alt="Logo" width='300px' height='auto'/>
</div>
<hr />

# NIX Desktop GUI


### What is NIX?
---

NIX is a digital currency that combines Atomic Swaps/Smart Contracts and privacy using our unique, innovative Ghost Protocol to provide the world with a truly anonymous and decentralized transfer of assets for the cross-chain era

### Key Features
---

* NIX utilizes a custom built privacy library that integrates Zerocoin/Stealthoutputs/Bulletproofs and TOR support. This allows transaction privacy in its fullest and most trustless form.

* NIX aims to create a privatized DEX platform built on top of already developed DEX volumes to conduct privatized atomic swaps through use of NIX’s privacy library.

* Ghost Protocol and Ghost Vault to enhance privacy features.

For more information, please visit [NixPlatform.io](https://nixplatform.io/nixplatform.io) or read the [whitepaper](https://nixplatform.io/docs/NIX-Platform-Whitepaper.pdf).


### Guides & Documentation

* [White Paper](https://nixplatform.io/docs/NIX-Platform-Whitepaper.pdf)
* [NIX Ghost Nodes](https://nixplatform.zendesk.com/hc/en-us/articles/360005044571-Setting-up-your-Ghost-Node)


### Links & Resources
---

* [NIX Website](https://nixplatform.io)
* [Discord Chat](https://chat.nixplatform.io/)
* [Reddit](https://reddit.com/r/nixplatform)
* [Medium](https://medium.com/@nixplatform)
* [Twitter](https://twitter.com/nixplatform)
* [GitHub wiki](https://github.com/nixplatform/nixcore/wiki)

This repository is the user interface that works in combination with [`Nix Core`](https://github.com/NixPlatform/NixCore/).

## Development

### Boostrapping for development:

* Download + Install [Node.js®](https://nodejs.org/) 6.4—7.10
* Download + Install [git](https://git-scm.com/)

```bash
git clone https://github.com/nixcore/nix-gui
cd nix-gui
yarn install
```

### Development with Electron

1. Run `ng serve` to start the dev server.
2. Run `yarn run start:electron:dev -testnet -opendevtools` to start the electron application. Daemon will be updated and launched automatically.
   * Note: this command will auto-refresh the client on each saved change
   * `-testnet` – for running on testnet (omit for running the client on mainnet)
   * `-opendevtools` – automatically opens Developer Tools on client launch

#### Interact with nix-core daemon

You can directly interact with the daemon ran by the Electron version.

```
./nix-cli -testnet getblockchaininfo
```

## Running

### Start Electron

* `yarn run start:electron:fast` – disables debug messages for faster startup (keep in mind using `:fast` disables auto-reload of app on code change)

### Package Electron

* `yarn run package:win` – Windows
* `yarn run package:mac` – OSX
* `yarn run package:linux` – Linux

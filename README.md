# Système de vote décentralisé (smart contract)

## Introduction
Le vote peut porter sur un petit nombre de propositions (ou de candidats) présélectionnées, ou sur un nombre potentiellement important de propositions suggérées de manière dynamique par les électeurs eux-mêmes. 

Les électeurs sont inscrits sur une liste blanche (whitelist) grâce à leur adresse Ethereum, et peuvent soumettre de nouvelles propositions lors d'une session d'enregistrement des propositions, et peuvent voter sur les propositions lors de la session de vote.

Le vote n'est pas secret ; chaque électeur peut voir les votes des autres.

Le gagnant est déterminé à la majorité simple ; la proposition qui obtient le plus de voix l'emporte.

## Features 

- L'administrateur du vote enregistre une liste blanche d'électeurs identifiés par leur adresse Ethereum.
- L'administrateur du vote commence la session d'enregistrement de la proposition.
- Les électeurs inscrits sont autorisés à enregistrer leurs propositions pendant que la session d'enregistrement est active.
- L'administrateur de vote met fin à la session d'enregistrement des propositions.
- L'administrateur du vote commence la session de vote.
- Les électeurs inscrits votent pour leurs propositions préférées.
- L'administrateur du vote met fin à la session de vote.
- L'administrateur du vote comptabilise les votes.
- Tout le monde peut vérifier les derniers détails de la proposition gagnante.

## Installation

1) Clonez le repo.
```sh
$ git clone https://github.com/lorcannrauzduel/voting_system.git
```

2) Installez les dépendances.
```sh
$ cd voting_system
$ cd server
$ npm install
```

3) Configurez les informations concernant votre smart contract dans le fichier **server/contract/config.js**. (Exemple ci-dessous)
```sh
rpc_server: 'ws://127.0.0.1:7545',
contract_address : '0x08F9752d586C30F51586077c35a0ee3367d6eE0f',
abi: [...]
```

4) Lancez l'application.
```sh
$ node index.js
```
5) Déplacer le dossier client sur un serveur web (exemple: WAMP).

6) Go sur **localhost/client/login.php** pour tester.

7) Enjoy ;)

## Technologies
- Solidity (Smart Contract)
- Node.js (API)
- HTML, CSS, jQuery, Mustache (Front)

## Auteur
- Lorcann RAUZDUEL
- Arnaud DAUBER--NATALI
- Michael LOUISET

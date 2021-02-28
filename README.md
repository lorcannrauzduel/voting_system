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

1) Clonez le repo et installer les dépendances.
```sh
$ git clone https://github.com/lorcannrauzduel/voting_system.git
$ cd voting_system
$ cd app
$ npm install
```
2) Configurez les informations concernant votre smart contract dans le fichier app/config/contract.js. (Exemple ci-dessous)
```sh
rpc_server: 'ws://127.0.0.1:7545',
contract_address : '0x08F9752d586C30F51586077c35a0ee3367d6eE0f',
abi: [...]
```
3) Lancez l'application.

```sh
$ cd app
$ node index.js
```

## Technologies
Solidity, Node.js

## Auteur
- Lorcann RAUZDUEL
- Arnaud DAUBER--NATALI
- Michael LOUISET

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

## Technologies
- Solidity (Smart Contract)

## Auteur
- Lorcann RAUZDUEL
- Arnaud DAUBER--NATALI
- Michael LOUISET

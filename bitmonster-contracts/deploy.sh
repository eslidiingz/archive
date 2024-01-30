#!/bin/sh
npx hardhat run scripts/deploy.ts
npx hardhat run scripts/setup
npx hardhat test
// constants

import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Factory as FactoryContract } from "../generated/Factory/Factory";

import { Deforex as DeforexContract } from "../generated/Deforex/Deforex";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "{{factory_address}}";
export const DEFOREX_ADDRESS = "{{deforex_address}}";

export let factoryContract: FactoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export let deforexContract: DeforexContract = DeforexContract.bind(
  Address.fromString(DEFOREX_ADDRESS)
);
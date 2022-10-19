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
export const FACTORY_ADDRESS = "0xc349fC3183856a1F21E8FD9FF5589eCbc77Af443";
export const DEFOREX_ADDRESS = "0x7890F15ABE81E13B7a468f03a64704ed2D3fC802";

export let factoryContract: FactoryContract = FactoryContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export let deforexContract: DeforexContract = DeforexContract.bind(
  Address.fromString(DEFOREX_ADDRESS)
);
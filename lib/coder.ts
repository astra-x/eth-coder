/*
 This file is part of eth-coder.

 eth-coder is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 eth-coder is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with eth-coder.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file coder.ts
 * @author Youtao Xing <youtao.xing@icloud.com>
 * @date 2020
 */

import BN from 'bn.js';
import { AbiItem, AbiInput, sha3 } from 'web3-utils';
import abi from 'web3-eth-abi';

export { AbiItem as Item, AbiInput as Input } from 'web3-utils';

export interface Param {
  name: string;
  value: string | string[];
  type: string;
}

export interface Method {
  name: string | undefined;
  params: Param[];
}

export interface Event {
  name: string | undefined;
  params: Param[];
}

/**
 * Should be called to create new Coder instance
 *
 * @class Coder
 * @constructor
 * @param { AbiItem[] } items
 */
export class Coder {
  private _contract: any;
  private _abiCoder: abi.AbiCoder = <abi.AbiCoder><any>abi;
  private _methods: { [index: string]: AbiItem } = {};
  private _events: { [index: string]: AbiItem } = {};

  constructor(items: AbiItem[]) {
    const Contract = require('web3-eth-contract');
    this._contract = new Contract(items);

    items.map(item => {
      if (item.name) {
        const hash: string | null = sha3(
          item.name +
          '(' +
          item.inputs?.map(input => input.type).join(',') +
          ')'
        );
        if (hash) {
          if ('function' === item.type) {
            // method hash: web3.sha3('transfer(address,uint256)')
            // signature: the first 32bit of the method hash
            this._methods[hash.slice(2, 10)] = item;
          } else if ('event' === item.type) {
            // event hash: web3.sha3('Transfer(address,address,uint256)')
            // signature: the event hash
            this._events[hash] = item;
          }
        }
      }
    });
  }

  /**
   * Encodes parameters for a method, including method signature.
   *
   * @method encodeMethod
   * @param { string } method
   * @param { ...any[] } params the method's parameters
   * @return { string } the tx.data including the invoked method signature and encoded parameters
   */
  encodeMethod(method: string, ...params: any[]): string {
    return this._contract.methods[method](...params).encodeABI();
  }

  /**
   * Decodes tx.input to method and parameters.
   *
   * @method decodeMethod
   * @param { string } data the tx.input including the method signature and encoded parameters
   * @return { Method | null } the decoded method and parameters
   */
  decodeMethod(data: string): Method | null {
    const signature: string = data.slice(2, 10);
    const item: AbiItem = this._methods[signature];
    let params: Param[] = [];

    if (item && item.inputs) {
      let inputs: AbiInput[] = item.inputs;
      let decodedParams: { [index: string]: any } =
        this._abiCoder.decodeParameters(item.inputs, data.slice(10));

      for (let i = 0; i < inputs.length; i++) {
        const isAddress = inputs[i].type.indexOf('address') === 0;
        const isInt = inputs[i].type.indexOf('int') === 0;
        const isUint = inputs[i].type.indexOf('uint') === 0;
        let value: string | string[];

        if (isAddress) {
          if (Array.isArray(decodedParams[i])) {
            value = (<string[]>decodedParams[i]).map(_ => _.toLowerCase());
          } else {
            value = decodedParams[i].toLowerCase();
          }
        } else if (isInt || isUint) {  // isInt || isUint
          if (Array.isArray(decodedParams[i])) {
            value = (<(number | string | number[] | Uint8Array | Buffer | BN)[]>decodedParams[i]).map(val => new BN(val).toString());
          } else {
            value = new BN(decodedParams[i]).toString();
          }
        } else {
          value = decodedParams[i];
        }

        params.push({
          name: inputs[i].name,
          value: value,
          type: inputs[i].type,
        });
      }
    } else {
      return null;
    }

    return {
      name: item.name,
      params: params,
    }
  }

  /**
   * Decodes txReceipt.logs[].data and txReceipt.logs[].topics to event and parameters.
   *
   * @method decodeEvent
   * @param { string } data the txReceipt.logs[].data
   * @param { string[] } topics the txReceipt.logs[].topics
   * @return { Event | null } the decoded event and parameters
   */
  decodeEvent(data: string, topics: string[]): Event | null {
    if (topics.length < 1) {
      return null;
    }
    const item: AbiItem = this._events[topics[0]];
    let params: Param[] = [];

    if (item && item.inputs) {
      let inputs: AbiInput[] = item.inputs;
      let decodedParams: { [key: string]: string } =
        this._abiCoder.decodeLog(inputs, data, topics.slice(1));

      for (let i = 0; i < inputs.length; i++) {
        const isAddress = inputs[i].type.indexOf('address') === 0;
        const isInt = inputs[i].type.indexOf('int') === 0;
        const isUint = inputs[i].type.indexOf('uint') === 0;
        let value: string | string[];

        if (isAddress) {
          value = decodedParams[i].toLowerCase();
        } else if (isInt || isUint) {  // isInt || isUint
          value = new BN(decodedParams[i]).toString();
        } else {
          value = decodedParams[i];
        }

        params.push({
          name: inputs[i].name,
          value: value,
          type: inputs[i].type,
        });
      }
    } else {
      return null;
    }

    return {
      name: item.name,
      params: params,
    }
  }
}

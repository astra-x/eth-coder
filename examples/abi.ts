import {
  Coder,
  Erc20
} from '../lib/index';

const coder = new Coder(Erc20.abi);
const data = '0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000';

console.log(coder.decodeAbi(data));
console.log(coder.encodeAbi('transfer', '0x8b4ab4667ad81af60e914a33f3aee35865825df6', '100000000000000000000'));

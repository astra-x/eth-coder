# eth-coder
Typescript library for decoding data params and events from etherem transactions

# Install
```
npm install --save eth-coder
```

# Instantiate
```ts
import {
  Item,
  Param,
  Method,
  Coder,
  Erc20
} from 'eth-coder'; // Typescript

const coder = new Coder(Erc20.abi);
```

# Encode Tx data
```ts
const data: string = coder.encodeAbi('transfer', '0x8b4ab4667ad81af60e914a33f3aee35865825df6', '100000000000000000000');
```

# Decode Tx input
```ts
const data: string = '0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000';

const method: Method = coder.decodeAbi(data);
```

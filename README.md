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
  Event,
  Coder,
  Erc20
} from 'eth-coder'; // Typescript

const coder = new Coder(Erc20.abi);
```

# Encode Tx data
```ts
const data: string = coder.encodeMethod('transfer', '0x8b4ab4667ad81af60e914a33f3aee35865825df6', '100000000000000000000');
```

# Decode Tx input
```ts
const data: string = '0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000';

const method: Method = coder.decodeMethod(data);
```

# Decode TxReceipt event
```ts
const event: Event = coder.decodeEvent(
  '0x00000000000000000000000000000000000000000000000ad78ebc5ac6200000',
  [
    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    '0x00000000000000000000000057fbf0e343b2f42297b6b52526d5c2e88589a052',
    '0x0000000000000000000000008af5324a124a06f0348cb624fa0de9198a2da0cb',
  ],
);
```

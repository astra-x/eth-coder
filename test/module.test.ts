import {
  Coder,
  Erc20
} from '../lib/index';

test('ERC20 decode success', () => {
  const coder20 = new Coder(Erc20.abi);
  const data = '0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000';
  expect(
    coder20.decodeMethod(data)
  ).toEqual(
    {
      name: 'transfer',
      params: [
        {
          name: 'recipient',
          value: '0x8b4ab4667ad81af60e914a33f3aee35865825df6',
          type: 'address'
        },
        { name: 'amount', value: '100000000000000000000', type: 'uint256' }
      ]
    }
  );
});

test('ERC20 decode success with longer byte array', () => {
  const coder20 = new Coder(Erc20.abi);
  const data = '0xa9059cbb0000000000000000000000008b4AB4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000';
  expect(
    coder20.decodeMethod(data)
  ).toEqual(
    {
      name: 'transfer',
      params: [
        {
          name: 'recipient',
          value: '0x8b4ab4667ad81af60e914a33f3aee35865825df6',
          type: 'address'
        },
        { name: 'amount', value: '100000000000000000000', type: 'uint256' }
      ]
    }
  );
})

test('ERC20 encode success', () => {
  const coder20 = new Coder(Erc20.abi);
  expect(
    coder20.encodeMethod('transfer', '0x8b4ab4667ad81af60e914a33f3aee35865825df6', '100000000000000000000')
  ).toBe('0xa9059cbb0000000000000000000000008b4ab4667ad81af60e914a33f3aee35865825df60000000000000000000000000000000000000000000000056bc75e2d63100000')
})

test('ERC20 decode event', () => {
  const coder20 = new Coder(Erc20.abi);
  expect(
    coder20.decodeEvent(
      '0x00000000000000000000000000000000000000000000000ad78ebc5ac6200000',
      [
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '0x00000000000000000000000057fbf0e343b2f42297b6b52526d5c2e88589a052',
        '0x0000000000000000000000008af5324a124a06f0348cb624fa0de9198a2da0cb',
      ],
    )
  ).toEqual(
    {
      name: 'Transfer',
      params: [
        {
          name: 'from',
          value: '0x57fbf0e343b2f42297b6b52526d5c2e88589a052',
          type: 'address'
        },
        {
          name: 'to',
          value: '0x8af5324a124a06f0348cb624fa0de9198a2da0cb',
          type: 'address'
        },
        { name: 'value', value: '200000000000000000000', type: 'uint256' }
      ]
    }
  )
})

test('ERC20 decode event when topic length less than 1', () => {
  const coder20 = new Coder(Erc20.abi);
  expect(
    coder20.decodeEvent(
      '0x00000000000000000000000000000000000000000000000ad78ebc5ac6200000',
      [],
    )
  ).toBe(
    null
  )
})


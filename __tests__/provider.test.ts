import { defaultProvider, stark } from '../src';
import { toBN } from '../src/utils/number';
import { compiledArgentAccount, compiledErc20 } from './fixtures';

const { compileCalldata } = stark;

describe('defaultProvider', () => {
  describe('feeder gateway endpoints', () => {
    test('getContractAddresses()', async () => {
      const { GpsStatementVerifier, Starknet } = await defaultProvider.getContractAddresses();
      expect(typeof GpsStatementVerifier).toBe('string');
      expect(typeof Starknet).toBe('string');
    });
    test('getBlock(blockHash=0x26e33ad2807590b93e98a04e703d7d64d4ead13591b50984ae558bdbe8fbcd2, blockNumber=undefined)', () => {
      return expect(
        defaultProvider.getBlock(
          '0x26e33ad2807590b93e98a04e703d7d64d4ead13591b50984ae558bdbe8fbcd2'
        )
      ).resolves.not.toThrow();
    });
    test('getBlock(blockHash=undefined, blockNumber=168890)', () => {
      return expect(defaultProvider.getBlock(168890)).resolves.not.toThrow();
    });
    test('getBlock(blockHash=undefined, blockNumber=null)', () => {
      return expect(defaultProvider.getBlock()).resolves.not.toThrow();
    });
    test('getBlock() -> { blockNumber }', async () => {
      const block = await defaultProvider.getBlock();
      return expect(block).toHaveProperty('block_number');
    });
    test('getCode()', () => {
      return expect(
        defaultProvider.getCode(
          '0x01d1f307c073bb786a66e6e042ec2a9bdc385a3373bb3738d95b966d5ce56166',
          36663
        )
      ).resolves.not.toThrow();
    });
    test('getCode(blockHash=undefined, blockNumber=null)', () => {
      return expect(
        defaultProvider.getCode(
          '0x01d1f307c073bb786a66e6e042ec2a9bdc385a3373bb3738d95b966d5ce56166'
        )
      ).resolves.not.toThrow();
    });
    test('getStorageAt() with "key" type of number', () => {
      return expect(
        defaultProvider.getStorageAt(
          '0x01d1f307c073bb786a66e6e042ec2a9bdc385a3373bb3738d95b966d5ce56166',
          0,
          36663
        )
      ).resolves.not.toThrow();
    });
    test('getStorageAt() with "key" type of string', () => {
      return expect(
        defaultProvider.getStorageAt(
          '0x01d1f307c073bb786a66e6e042ec2a9bdc385a3373bb3738d95b966d5ce56166',
          '0',
          36663
        )
      ).resolves.not.toThrow();
    });
    test('getStorageAt() with "key" type of BN', () => {
      return expect(
        defaultProvider.getStorageAt(
          '0x01d1f307c073bb786a66e6e042ec2a9bdc385a3373bb3738d95b966d5ce56166',
          toBN('0x0'),
          36663
        )
      ).resolves.not.toThrow();
    });
    test('getStorageAt(blockHash=undefined, blockNumber=null)', () => {
      return expect(
        defaultProvider.getStorageAt(
          '0x01d1f307c073bb786a66e6e042ec2a9bdc385a3373bb3738d95b966d5ce56166',
          0
        )
      ).resolves.not.toThrow();
    });
    test('getTransactionStatus()', async () => {
      return expect(
        defaultProvider.getTransactionStatus(
          '0x37013e1cb9c133e6fe51b4b371b76b317a480f56d80576730754c1662582348'
        )
      ).resolves.not.toThrow();
    });
    test('getTransaction()', async () => {
      return expect(
        defaultProvider.getTransaction(
          '0x37013e1cb9c133e6fe51b4b371b76b317a480f56d80576730754c1662582348'
        )
      ).resolves.not.toThrow();
    });

    test('getTransactionReceipt', async () => {
      return expect(
        defaultProvider.getTransactionReceipt(
          '0x37013e1cb9c133e6fe51b4b371b76b317a480f56d80576730754c1662582348'
        )
      ).resolves.not.toThrow();
    });

    test('callContract()', () => {
      return expect(
        defaultProvider.callContract({
          contractAddress: '0x9ff64f4ab0e1fe88df4465ade98d1ea99d5732761c39279b8e1374fa943e9b',
          entrypoint: 'balance_of',
          calldata: compileCalldata({
            user: '0x9ff64f4ab0e1fe88df4465ade98d1ea99d5732761c39279b8e1374fa943e9b',
          }),
        })
      ).resolves.not.toThrow();
    });

    test('transaction trace', async () => {
      const transactionTrace = await defaultProvider.getTransactionTrace(
        '0x37013e1cb9c133e6fe51b4b371b76b317a480f56d80576730754c1662582348'
      );
      expect(transactionTrace).toHaveProperty('function_invocation');
      expect(transactionTrace).toHaveProperty('signature');
    });
  });

  describe('addTransaction()', () => {
    test('declareContract()', async () => {
      const response = await defaultProvider.declareContract({
        contract: compiledErc20,
      });

      expect(response.code).toBe('TRANSACTION_RECEIVED');
      expect(response.transaction_hash).toBeDefined();
      expect(response.class_hash).toBeDefined();
    });

    test('deployContract()', async () => {
      const response = await defaultProvider.deployContract({
        contract: compiledArgentAccount,
      });

      expect(response.code).toBe('TRANSACTION_RECEIVED');
      expect(response.transaction_hash).toBeDefined();
      expect(response.address).toBeDefined();
    });
  });
});

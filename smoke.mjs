// Runs after the workaround install: the libraries themselves work.
import { Envelope } from '@blockchaincommons/envelope';
import '@blockchaincommons/envelope/all';
import { format } from '@blockchaincommons/envelope/format';

const e = Envelope.from('Alice').addAssertion('knows', 'Bob');
const bytes = e.toCbor().toData();
console.log(format(e));
console.log(`${bytes.length} bytes, starts 0x${bytes[0].toString(16)} 0x${bytes[1].toString(16)} (tag 200)`);

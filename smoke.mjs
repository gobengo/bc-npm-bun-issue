// Runs once the package is installed: it works.
import { PrivateKeys, XID } from '@blockchaincommons/components';

const keys = PrivateKeys.random();
console.log('new keys, XID', XID.fromPublicKeys(keys.publicKeys()).toString());

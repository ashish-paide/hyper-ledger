const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const helper = require('./helper')

async function createTranscientData() {
  try {
    logger.debug(util.format('\n============ Creating Transcient Data %s ============\n', channelName));
    // Create a new file system wallet
    // const walletPath = path.join(process.cwd(), 'wallet');
    // const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Specify the connection profile and the identity to use
    // const connectionProfile = path.resolve(__dirname, 'connection.json');
    // const identity = 'user1';

    // load the network configuration
    const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

    // Create a new file system based wallet for managing identities.
    const walletPath = await helper.getWalletPath(org_name) //path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);
    
    let identity = await wallet.get(username);
    if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
    }

        

    const connectOptions = {
        wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
            // transaction: {
            //     strategy: createTransactionEventhandler()
            // }
    }


    // // Connect to the network using the wallet and connection profile
    // const gateway = new Gateway();
    // await gateway.connect(connectionProfile, { wallet, identity, discovery: { enabled: true, asLocalhost: true } });

    // Get the network and contract
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('fabcar');

    // Create the transient data map
    const transientData = {
      myKey: 'myValue',
    };

    // Create the transaction proposal
    const transactionProposal = contract.createTransaction('myFunction');
    transactionProposal.setTransient(transientData);

    // Submit the transaction proposal
    const transactionResponse = await transactionProposal.submit();

    console.log('Transaction response:', transactionResponse.toString());

    // Disconnect from the gateway
    await gateway.disconnect();
  } catch (error) {
    console.error('Failed to submit transaction:', error);
    process.exit(1);
  }
}

invokeChaincode();
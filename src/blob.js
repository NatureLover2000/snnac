var StellarSdk = require("stellar-sdk");

// Input the secretKey of the account from which the transaction will be sent
var sourceKeys = StellarSdk.Keypair.fromSecret("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",);

var server = new StellarSdk.Server("https://horizon-testnet.stellar.org");

exports.testwebpack = function testwebpack(hello) {
    alert(hello);
}

exports.send = function send(destinationId, amount) {
	server
	.loadAccount(destinationId)
	.catch(function (error) {
		if (error instanceof StellarSdk.NotFoundError) {
			throw new Error("The destination account does not exist!");
		} else return error;  
	})
	.then(function() {
		return server.loadAccount(sourceKeys.publicKey());
	})
	.then(function(sourceAccount) {
		var transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
			        fee: StellarSdk.BASE_FEE,      
			        networkPassphrase: StellarSdk.Networks.TESTNET,    
		})
		  .addOperation(
			          StellarSdk.Operation.payment({
					  destination: destinationId,
					  // Because Stellar allows transaction in many currencies, you must
					  // specify the asset type. The special "native" asset represents Lumens.
					  asset: StellarSdk.Asset.native(),          i
					  amount: amount,        
				  }),
		  )
		.addMemo(StellarSdk.Memo.text("Test Transaction"))
		.setTimeout(180).build();
		transaction.sign(sourceKeys);
		return server.submitTransaction(transaction);
	})
	.then(function (result) {
        alert("Success! Results:" + JSON.stringify(result));
		console.log("Success! Results:", result);
	})
	.catch(function (error) {
		console.error("Something went wrong!", error);
	});
}

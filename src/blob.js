var StellarSdk = require("stellar-sdk");

var sourceKeys = StellarSdk.Keypair.fromSecret("SGLQQYJQ3LPWJQGMRD6TNKORPWCBR2QEKEW5NU3L2DKHXAEZCEKS",);
var destinationId = "GCWQFQ4EDIAIWIUYJ7V3XF67RRSUVQCRFTPPWZARPTIQ55T3D6M";

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
					  asset: StellarSdk.Asset.native(),          
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
		// If the result is unknown (no response body, timeout etc.) we simply resubmit
		// already built transaction:
		// server.submitTransaction(transaction);
	});
}

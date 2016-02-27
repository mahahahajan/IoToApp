
  $(document).ready(function() {
    $("#simplify-payment-form").on("submit", function() {
      // Disable the submit button
      $("#process-payment-btn").attr("disabled", "disabled");
      // Generate a card token & handle the response
      SimplifyCommerce.generateToken({
        key: "sbpb_NDUxNjA2OGItYTkyOC00ZjA4LThhZmItZDJlOTVjNDI5NDZl",
        card: {
          number: $("#cc-number").val(),
          cvc: $("#cc-cvc").val(),
          expMonth: $("#cc-exp-month").val(),
          expYear: $("#cc-exp-year").val()
        }
      }, simplifyResponseHandler);
      // Prevent the form from submitting
      return false;
    });
  });

		function simplifyResponseHandler(data) {
			var $paymentForm = $("#simplify-payment-form");
			// Remove all previous errors
			$(".error").remove();
			// Check for errors
			if (data.error) {
				// Show any validation errors
				if (data.error.code == "validation") {
					var fieldErrors = data.error.fieldErrors,
						fieldErrorsLength = fieldErrors.length,
						errorList = "";
					for (var i = 0; i < fieldErrorsLength; i++) {
						errorList += "<div class='error'>Field: '" + fieldErrors[i].field +
							"' is invalid - " + fieldErrors[i].message + "</div>";
					}
					// Display the errors
					$paymentForm.after(errorList);
				}
				// Re-enable the submit button
				$("#process-payment-btn").removeAttr("disabled");
			} else {
				// The token contains id, last4, and card type
				var token = data["id"];
				// Insert the token into the form so it gets submitted to the server
				$paymentForm.append("<input type='hidden' name='simplifyToken' value='" + token + "' />");
				// Submit the 8form to the server
				$paymentForm.get(0).submit();
			}
		}

  		var Simplify = require("simplify-commerce"),
  			client = Simplify.getClient({
  				publicKey: 'sbpb_NDUxNjA2OGItYTkyOC00ZjA4LThhZmItZDJlOTVjNDI5NDZl',
  				privateKey: '0EmF7Lbezm3yph8syaCIcvxeJOikjrRXjmYVCUZQt+F5YFFQL0ODSXAOkNtXTToq'
  			});
  		client.payment.create({
  			amount: "10",
  			token: "[TOKEN ID]",
  			description: "payment description",
  			reference: "7a6ef6be31",
  			currency: "USD"
  		}, function(errData, data) {
  			if (errData) {
  				console.error("Error Message: " + errData.data.error.message); // handle the error return;
  			}
  			console.log("Payment Status: " + data.paymentStatus);
  		});

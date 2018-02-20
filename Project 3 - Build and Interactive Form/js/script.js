document.addEventListener("DOMContentLoaded", () => {
	const $form = document.querySelector("form"),
		  $jobTitle = $form.querySelector("select#title"),
		  $otherTitle = $form.querySelector("#other-title"),
		  $tshirtDesign = $form.querySelector("#design"),
		  $tshirtColors = $form.querySelector("#color"),
		  $activities = $form.querySelector(".activities"),
		  $activityCheckboxes = $activities.querySelectorAll('input[type="checkbox"]'),
		  $activityLabels = $activities.querySelectorAll('label'),
		  $paymentSelect = $form.querySelector("#payment"),
		  $creditSection = $form.querySelector("#credit-card"),
		  $paypalSection = $form.querySelector("#paypal"),
		  $bitcoinSection = $form.querySelector("#bitcoin");

	let jsPunstshirtColors = [],
	  	iLvjstshirtColors = [],
	  	selectedActivyTimes = [],
	  	selectedCourseCosts = [];

	const sum = (a, b) => a + b;

	/**
	 * This function is used to populate an array of t-shirt options for each design
	 */
	(function parseOptions() {
		const $options = $tshirtColors.querySelectorAll("option");

		$options.forEach(function(v) {
			let attr = v.getAttribute("data-design");
			attr === "js puns" ? jsPunstshirtColors.push(v) : iLvjstshirtColors.push(v);
		})
	})();

	/**
	 * Function used to set the select options based on the design chosen by the user
	 * @param  {object} e      [event object]
	 * @param  {object} select [Select element to append options to]
	 */
	function buildDropdown(e, select) {
		const val = e.target.value,
			  $select = select,
			  $options = $select.querySelectorAll("option");

		$options.forEach(function(v) {
			let attr = v.getAttribute("data-design");
			if (val === attr) {
				v.style.display = "";
			} else {
				v.style.display = "none";
			}
		})

		if ( val === 'js puns' ) {
			$select.value = jsPunstshirtColors[0].value;
		} else {
			$select.value = iLvjstshirtColors[0].value;
		}
	}
	
	/**
	 * Function used to flag events that occur during the
	 * same time slot as the activity the user has selected
	 * @param  {object} e [event object]
	 */
	function checkActivitySchedule(e) {
		var $target = e.target,
			$label = e.target.parentNode,
			labelText = $label.textContent,
			labelTime = $label.textContent.split(" — ")[1].split(", ")[0],
			selectedActivyTimes = [];

		// if checkbox is checked turn label bold and push to array of selected activities
		// else reset font weight
		if ( $target.checked ) {
			selectedActivyTimes.push(labelTime)
			$label.style.fontWeight = "bold";
		} else {
			$label.style.fontWeight = "normal";
		}

		// loop through activity labels and search for conflicting times
		// build up an array of selected activities
		// disable and gray out checkboxes/labels for conflicting times
		$activityLabels.forEach(function(v,k) {
			let labelSubstring = v.textContent.split(" — ")[1].split(", ")[0];
			if ( v.firstElementChild.checked ) {
				if ( !selectedActivyTimes.includes(labelSubstring)) {
					selectedActivyTimes.push(labelSubstring)
				}
			}
			
			if ( v.textContent !== labelText && selectedActivyTimes.includes(labelSubstring) && !v.firstElementChild.checked) {
				v.style.color = "#777";
				v.firstElementChild.disabled = true;
			} else {
				v.style.color = "#000";
				v.firstElementChild.disabled = false;
			}
		})

		// Display the total cost of the selected activies if cost is greater than 0
		const $totalCost = document.querySelector("#total-cost");
		let cost = calculateTotalCost();
		if (cost > 0) {
			$totalCost.textContent = 'Total Cost: $' + calculateTotalCost();
		} else {
			$totalCost.textContent = "";
		}
	}

	/**
	 * Function used to calculate the total cost of selected activities
	 * @return {number} [sum of activity costs]
	 */
	function calculateTotalCost() {
		selectedCourseCosts = [];
		$activityCheckboxes.forEach(function(v,k) {
			let cost =  v.parentNode.textContent.split("$")[1];
			if ( v.checked ) {
				selectedCourseCosts.push(parseFloat(cost));
			}
		})
		if (selectedCourseCosts.length === 0) {
			return 0;
		} else {
			return selectedCourseCosts.reduce(sum);
		}
	}

	/**
	 * Function used to display appropriate payment info based on the user's selection
	 * @param  {object} e [event object]
	 */
	function displayPaymentInfo(e) {
		const val = e.target.value;			

		if ( val === "paypal") {
			$paypalSection.style.display = "";
			$creditSection.style.display = "none";
			$bitcoinSection.style.display = "none";
		} else if ( val === "bitcoin") {
			$paypalSection.style.display = "none";
			$creditSection.style.display = "none";
			$bitcoinSection.style.display = "";
		} else {
			$paypalSection.style.display = "none";
			$creditSection.style.display = "";
			$bitcoinSection.style.display = "none";
		}
	}

	/**
	 * Function used to validate form content
	 * @return {[type]} [description]
	 *
	 * NEEDS TO CHECK FOR
	 * [] name field (not blank)
	 * [] email field (valid format)
	 * [] activities (at least one selected)
	 * [] payment
	 * 		+ credit card number (13 - 16 digits, number)
	 * 		+ zip (5 digits, number)
	 * 		+ CVV (3 digit, number)
	 */
	function validateForm() {
		const $nameInput = $form.querySelector("#name"),
			  $emailInput = $form.querySelector("#mail"),
			  checkboxesArray = [];

		// Name Validation
		if ( $nameInput.value === "" ) {
			setFormErrorStyle($nameInput, false);
		} else {
			setFormErrorStyle($nameInput, true);
		}

		// Email Validation
		var emailRegEx = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

		if ( !emailRegEx.test($emailInput.value) || $emailInput.value === "" ) {
			setFormErrorStyle($emailInput, false);
		} else {
			setFormErrorStyle($emailInput, true);
		}

		// Activities Validation
		$activityCheckboxes.forEach(function(v,k) {
			if ( v.checked ) { checkboxesArray.push(v); }
		})

		if  ( checkboxesArray.length === 0 ) {
			$activities.querySelector("legend").style.color = "#af2020";
		} else {
			$activities.querySelector("legend").style.color = "#184f68";
		}


	}

	function setFormErrorStyle(target, valid) {
		if ( !valid ) {
			target.style.border = "2px solid #df6161";
			target.style.backgroundColor = "#ffdada";
		} else {
			target.style.border = "2px solid #c1deeb";
			target.style.backgroundColor = "#c1deeb";
		}
	}

	//	display other job title on page load
	$otherTitle.style.display = "none";

	// set default value and display for payment section
	$paymentSelect.value = "credit card";
	$paypalSection.style.display = "none";
	$bitcoinSection.style.display = "none";

	// define behavior for when the user changes their job title
	// if user selects other, display text inpuit that lets
	// them define other job title
	$jobTitle.addEventListener("change", (e) => {
		const val = e.target.value;
		val === "other" ? $otherTitle.style.display = "" : $otherTitle.style.display = "none";
	})

	$tshirtDesign.addEventListener("change", (e) => {
		buildDropdown(e, $tshirtColors);
	})

	$activities.addEventListener("change", (e) => {
		checkActivitySchedule(e);
	})

	$paymentSelect.addEventListener("change", (e) => {
		displayPaymentInfo(e);
	})

	$form.addEventListener("submit", (e) => {
		e.preventDefault();
		validateForm();
	})


});
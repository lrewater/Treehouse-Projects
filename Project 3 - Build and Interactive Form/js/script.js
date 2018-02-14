document.addEventListener("DOMContentLoaded", () => {
	const $form = document.querySelector("form"),
		  $jobTitle = $form.querySelector("select#title"),
		  $otherTitle = $form.querySelector("#other-title"),
		  $tshirtDesign = $form.querySelector("#design"),
		  $tshirtColors = $form.querySelector("#color"),
		  jsPunstshirtColors = [],
		  iLvjstshirtColors = [];

	(function parseOptions() {
		const $options = $tshirtColors.querySelectorAll("option");

		$options.forEach(function(v) {
			let attr = v.getAttribute("data-design");
			attr === "js puns" ? jsPunstshirtColors.push(v) : iLvjstshirtColors.push(v);
		})
	})();

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

	// hide other job title text input on page load
	$otherTitle.style.display = "none";

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


});
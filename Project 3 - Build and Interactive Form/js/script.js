document.addEventListener("DOMContentLoaded", () => {
	const $form = document.querySelector("form");
	const $jobTitle = $form.querySelector("select#title");
	const $otherTitle = $form.querySelector("#other-title");

	$otherTitle.style.display = "none";

	$jobTitle.addEventListener("change", (e) => {
		const val = e.target.value;
		val === "other" ? $otherTitle.style.display = "" : $otherTitle.style.display = "none";
	})


});
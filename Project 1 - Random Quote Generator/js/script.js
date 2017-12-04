/**
 * [Function used to determine if a property is null]
 * @param  {[string or numbere]}  prop [value to check]
 * @return {Boolean}      [defined status]
 */
function isDefined(prop) {
	if (prop === null || prop === '') {
		return false
	} else {
		return true;
	}
}

/**
 * [Function used to return random quote]
 * @return {[object]} [randomQuote from quotes array]
 */
function getRandomQuote() {
	var upper = quotes.length; // define upper bound of random number
	var randomNumber = Math.floor(Math.random() * upper); // define a random number between 0 and quotes array length
	return quotes[randomNumber]; // return quote at index of random number
}

/**
 * [Function used to print random quote to page]
 * @return {[type]} [description]
 */
function printQuote() {
	var quoteBox = document.getElementById('quote-box');

	var randomQuote = getRandomQuote();
	var html = '<p class="quote">' + randomQuote.quote + '</p>';
	html += '<p class="source">' + randomQuote.source;
	if (isDefined(randomQuote.citation)) {
		html += '<span class="citation">' + randomQuote.citation + '</span>';
	}
	if (isDefined(randomQuote.date)) {
		html += '<span class="year">' + randomQuote.date + '</span>';
	}
	html += '</p>';
	quoteBox.innerHTML = html;
	changeBackground();

	/*<p class="quote">You can do anything but not everything</p>
      <p class="source">David Allen<span class="citation">Making It All Work</span><span class="year">2009</span></p>*/
}

/**
 * [Function used to generate a random CSS rgb color strng]
 * @return {[string]} [random CSS rgb color string]
 */
function randomRGB() {
	var rgb = 'rgb('+ Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
	return rgb;
}

/**
 * [Function used to update background color for body and #loadQuote button]
 * @return {[type]} [description]
 */
function changeBackground() {
	// define DOM elements that will have their background color updated
	var body = document.body,
		button	= document.getElementById('loadQuote');

	var rgb = randomRGB(); // retrieve random rgb colo string
	body.style.backgroundColor = rgb; // update body background color
	loadQuote.style.backgroundColor = rgb; // update '#loadQuote' background color
}

printQuote();

// event listener to respond to "Show another quote" button clicks
// when user clicks anywhere on the button, the "printQuote" function is called
document.getElementById('loadQuote').addEventListener("click", printQuote, false);

// update quote every 5 seconds
setInterval(printQuote, 5000);


(function() {

	var $page = $( '.page' ),
		$list = $( 'ul.student-list' ),
		$listItems = $( '.student-item' ),
		$pagination = $( '.pagination' ),
		$search = $( '.student-search input' ),
		$searchBtn = $( '.student-search button' ),
		listLength = $listItems.length,
		pagesNeeded = calcPagesNeeded(listLength);

	/**
	 * Function used to calculate the number of pagination links needed
	 * @return {number} [number of pages needed]
	 */
	function calcPagesNeeded(len) {
		return Math.ceil(len/10);
	}

	function showPage(pageNo, listItems) {
		var upperBound = pageNo * 10,
			lowerBound = upperBound - 10;
		for (let i = 0; i < listItems.length; i++) {
			if (i >= lowerBound && i <= upperBound) {
				$( listItems[i] ).show();		
			} else {
				$( listItems[i] ).hide();
			}
		}
	}

	function getPage(e) {
		e.preventDefault();
		var activePage = e.target;
		var pageNo = parseInt($( activePage ).text());
		setActivePage(pageNo, $( '.pagination li' ));
		showPage(pageNo, $( 'li.student-item' ));
	}

	function setActivePage(pageNo, pageLinks) {
		for (var i = 0; i < pageLinks.length; i++) {
			$( pageLinks[i] ).find('a').removeClass("active");
		}
		$( pageLinks[pageNo - 1] ).find('a').addClass('active');
	}

	function getSearchTerms() {
		return $search.val().toLowerCase();
	}

	function displaySearchResults() {
		var matched = [], // array that will hold list of matched students
			students = []; // array that will hold student names and email addresses

		// Obtain the value of the search input
		var searchTerm = getSearchTerms();
    	// remove the previous page link section 
    	removePagination();   
    	// Loop over the student list, and for each student…
			// ...obtain the student’s name…
			// ...and the student’s email…
		for (let i = 0; i < $listItems.length; i++) {
			$( $listItems[i] ).hide();
			let student = $( $listItems[i] );
				students.push({name: student.find('h3').text().toLowerCase(), email: student.find('span.email').text().toLowerCase(), index: i});
		}
		// ...if the search value is found inside either email or name…
    		// ...add this student to list of “matched” student
    	matched = students.filter(function (d) {
    		return d.name.includes(searchTerm) ||
    			   d.email.includes(searchTerm);
    	});

    	for (let i = 0; i < matched.length; i++) {
    		var index = matched[i].index;
    		$( $listItems[index] ).show();
    	}

    	let searchCount = matched.length;

    	$list.find('.search-alert').remove();
    	if (matched.length === 0) {    		
    		$list.append('<h3 class="search-alert">No results found for current search</h3>')
    	} else {
    		buildPagination(calcPagesNeeded(searchCount));
    	}
		
    	// If there’s no “matched” students…
           // ...display a “no student’s found” message
   		// If over ten students were found…
           // ...call appendPageLinks with the matched students
	   // Call showPage to show first ten students of matched list

	}

	function refreshResults() {
		var searchTerm = getSearchTerms();
		if ( searchTerm === "" ) {
			for (let i = 0; i < $listItems.length; i++) {
				$( $listItems[i] ).show();
			}
			buildPagination(pagesNeeded);
		}
	}

	$search.on("input", displaySearchResults)
	$search.on("input", refreshResults)
	$searchBtn.on("click", displaySearchResults)

	/**
	 * Function used to remove pagination links if they exist
	 */
	function removePagination() {
		if ($pagination.length > 0) {
			$pagination.remove();
		};
	}

	/**
	 * Function used to build student list pagination
	 * @return {string} [HTML for pagination]
	 */
	function buildPagination(len) {
		removePagination();
		var html = '<div class="pagination"><ul>';
		for (let i = 0; i < len; i++) {
			html += '<li><a href="#">' + (i+1) + '</a></li>';
		}
		html += '</ul></div>';
		$page.append(html);
		showPage(1, $( 'li.student-item' ))
		$( '.pagination ul').on("click", getPage)
		setActivePage(1, $( '.pagination li' ));	
		$pagination = $( '.pagination' ); //u update DOM reference
	}

	buildPagination(pagesNeeded);

})();
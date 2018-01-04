(function() {
	var $page = $( '.page' ),
		$listItems = $( '.student-item' ),
		$pagination = $( '.pagination' ),
		listLength = $listItems.length,
		pagesNeeded = calcPagesNeeded(listLength);

	/**
	 * Function used to calculate the number of pagination links needed
	 * @return {number} [number of pages needed]
	 */
	function calcPagesNeeded(len) {
		return Math.ceil(len/10);
	}

	/**
	 * Function used to determine the page the user has selected
	 * @return {number} [active page] 
	 */
	function getActivePage(e) {
		e.preventDefault();
		var $activePage = $( e.target );
		var $pageLinks = $( '.pagination ul li' );
		for (let i = 0; i < $pageLinks.length; i++) {
			var $pageLink = $( $pageLinks[i] );
			$pageLink.find( 'a' ).removeClass('active');
		}
		$activePage.addClass('active')
	}

	/**
	 * Function used to set active pagination list item
	 */
	function setActivePage(page) {
		var $pageLinks = $( '.pagination ul li' );
		var $activePage = $( $pageLinks[page] );
		$activePage.find( 'a' ).addClass('active');
	}

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
		$( '.pagination ul').on("click", getActivePage)		
		setActivePage(0);
	}

	// hide all list items except for the first 10
	for (let i = 0; i < listLength; i++) {
		if ( i > 10 ) {
			$($listItems[i]).hide();
		}
	}

	buildPagination(pagesNeeded);

})();
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

	function showPage(pageNo, listItems) {
		var upperBound = pageNo * 10,
			lowerBound = upperBound - 9;

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
		//setActivePage(0);
	}

	buildPagination(pagesNeeded);

})();
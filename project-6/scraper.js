const fs = require('fs');
const cheerio = require('cheerio');
const request = require('request');
const json2csv = require('json2csv').parse;

let shirts = [];

function requestPage(url, callback) {
  request(url, function (error, response, body) {
    if ( error ) {
      console.error(error);
    } else if ( response.statusCode === 404 ) {
      console.error('Error: Page Not Found');
    } else if ( response.statusCode === 200 ) {
      callback(body, url);
    }
  });
}

requestPage('http://shirts4mike.com/shirts.php', scrapePageUrls);

function scrapePageUrls(html) {
  const $ = cheerio.load(html);
  let ul = $( 'ul.products' ),
      listItems = ul.find( 'li' );

  listItems.each( (index, item) => {
    let link = $(item).find('a').attr("href");
    requestPage(`http://shirts4mike.com/${link}`, scrapeShirtDetails);
  })
}

function addZeroToTime(val) {
  if ( parseInt(val) < 10 ) {
    return `0${val}`;
  } else {
    return val;
  }
}

// scrape price, title, url and image url
function scrapeShirtDetails(html, link) {
  const $ = cheerio.load(html);
  let picture = $( '.shirt-picture' ).find('img').attr("src");
  let price = parseFloat($( '.shirt-details' ).find('.price').text().replace("$", ""));
  let titlePrep = $( '.shirt-details h1 span' ).remove();
  let title = $( '.shirt-details h1' ).text().trim();
  let date = new Date();
  let formattedTime = `${addZeroToTime(date.getHours())}:${addZeroToTime(date.getMinutes() + 1)}:${addZeroToTime(date.getSeconds())}`;

  let shirt = {
    Title: title,
    Price: price,
    ImageURL: `http://shirts4mike.com/${picture}`,
    "URL": link,
    Time: formattedTime
  }
  shirts.push(shirt);
  checkDir('./data/', () => {
    createCSV(shirts);
  });
}

function createCSV(data) {
  const fields = ['Title', 'Price', 'ImageURL', 'URL', 'Time'];
  const opts = { fields };

  try {
    const csv = json2csv(data, opts);
    let date = new Date();
    let formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    fs.writeFileSync(`./data/${formattedDate}.csv`, csv, (err) => {
      // throws an error, you could also catch it here
      if (err) throw err;
      // success case, the file was saved
      console.log('CSV saved!')
    })
  } catch (err) {
    console.error(err);
  }
}

// Check for data directory
// if exists do nothing,
// else create directory

/**
 * This function is used to check if a directory exists
 * If the specified directory does not exist it is created
 * @param  {string} dir [name of directory to check for]
 */
function checkDir(dir, callback) {
  fs.open(dir, 'r', (err, fd) => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('The data directory does not exist.');
        createDirectory(dir);
        return;
      }
    }
    callback();
  });
}

/**
 * This function is used to create a directory
 * @param  {string} dir [name of directory to create]
 */
function createDirectory(dir) {
  fs.mkdir('./data/', err => {
    if (err) {
      if (err.code === 'ENOENT') {
        console.error('The data directory could not be created.');
        return;
      }
      throw err;
    }
  })
}

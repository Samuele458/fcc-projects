// read a random quote
function getRandomQuote(handleQuote) {
  let quote = $.ajax({
    dataType: "json",
    type: "GET",
    url: "https://api.quotable.io/random",
    success: function (data) {
      const quoteObj = {
        author: data.author,
        content: data.content,
      };
      handleQuote(quoteObj);
    },
  });

  return quote.keys;
}

//execute when page il fully loaded
$(document).ready(() => {
  let quote;
  getRandomQuote((data) => {
    quote = data;
    console.log(quote);
  });
  console.log(quote);
});

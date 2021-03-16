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

//show on page a random quote
function showRandomQuote() {
  getRandomQuote((quote) => {
    $("#text").text(quote.content);
    $("#author").text(quote.author);
  });
}

function setPageColor(color) {
  $("body").css("background-color", color);
  $("#quote-box").css("color", color);
}

function getRandomColor() {
  const colors = [
    "#4287f5",
    "#ff3021",
    "#ffd500",
    "#73ff00",
    "#00e5ff",
    "#b300ff",
    "#ff00d0",
    "#9d25d9",
  ];

  const randomIndex = Math.floor(Math.random() * (colors.length - 1));

  return colors[randomIndex];
}

//execute when page il fully loaded
$(document).ready(() => {
  //load first quote
  showRandomQuote();
  setPageColor(getRandomColor());

  $("#new-quote").click(() => {
    //set a new random quote
    showRandomQuote();

    setPageColor(getRandomColor());
  });
});

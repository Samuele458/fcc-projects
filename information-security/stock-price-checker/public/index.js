$(function () {
  $("#form1").submit(function (e) {
    $.ajax({
      url: "/api/stock-prices",
      type: "get",
      data: $("#form1").serialize(),
      success: function (data) {
        $("#stock-name").html(data.stockData.stock || "");
        $("#stock-price").html(data.stockData.price || "");
        $("#stock-likes").html(data.stockData.likes || "");
      },
    });
    e.preventDefault();
  });
  $("#form2").submit(function (e) {
    $.ajax({
      url: "/api/stock-prices",
      type: "get",
      data: $("#form2").serialize(),
      success: function (data) {
        $("#multi-stock-name-1").html(data.stockData[0].stock || "");
        $("#multi-stock-price-1").html(data.stockData[0].price || "");
        $("#multi-stock-likes-1").html(data.stockData[0].rel_likes || "");
        $("#multi-stock-name-2").html(data.stockData[1].stock || "");
        $("#multi-stock-price-2").html(data.stockData[1].price || "");
        $("#multi-stock-likes-2").html(data.stockData[1].rel_likes || "");
      },
    });
    e.preventDefault();
  });
});

$(function() {
  // generate list elements
  for(var i = 1; i <= 20; i++)
    $("#sortable").append("<div id='elem" + i + "'><span class='handle'>&#9776;</span> List element " + i + "</div>");
  // make list sortable
  $("#sortable").sortable({ handle: ".handle" });
  // get configuration
  $("#getOutput").click(function() {
    $("#output").text($("#sortable").sortable("toArray"));
    // .sortable("toArray") will output a JS array of the IDs of the elements
  }).click();
});

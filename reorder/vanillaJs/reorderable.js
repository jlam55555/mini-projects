// Reorderable constructor: just supply parent element; values array optional
var Reorderable = function(container, values) {

  // populate with values if valid
  if(values)
    container.innerHTML = "<div>" + values.join("</div><div>") + "</div>";

  // reorderable children as HTMLElementList and as array; HTMLElementList remains ordered, array does not
  var reorderable = container.children;
  var reorderableArr = Array.from(reorderable);

  // todrag holds dragged item (when applicable)
  var todrag; 

  // locked holds hidden or not. Default false
  var locked = false;

  // gets nearest element (finds mouse percentage of total height and multiplies it by the number of elements
  var getNearest = function() {
    return Math.round((event.pageY - container.offsetTop) / container.clientHeight * reorderable.length);
  };

  // gets Y coordinate in the reorderable box -- deals with cases of mouse over the top or under bottom
  var getYCoor = function(y) {
    return y < container.offsetTop ? 0 : y > container.offsetTop + container.clientHeight ? container.clientHeight : y - container.offsetTop;
  };

  // set container to fixed height:
  container.style.height = container.clientHeight + "px";

  // mousemove acts when dragged item
  document.body.addEventListener("mousemove", function(event) {
    if(!todrag) return;

    // this "drags" the element
    todrag.style.top = getYCoor(event.pageY)-10 + "px";

    // clear margins
    for(elem of reorderableArr)
      elem.style.marginTop = "0";

    // get nearest
    var nearest = getNearest(); 

    // set margin to appropriate elements
    if(reorderable.item(nearest) == todrag && reorderableArr.indexOf(todrag) != reorderable.length-1)
      reorderable.item(nearest+1).style.marginTop = todrag.clientHeight + 4 + "px";
    else if(nearest >= 0 && nearest < reorderable.length)
      reorderable.item(nearest).style.marginTop = todrag.clientHeight + 4 + "px";
    
    console.log(nearest);
    
  });

  // add event listeners to every resizable element
  for(elem of reorderableArr) {

    // add handle
    elem.innerHTML = "<div class='handle'></div>" + elem.innerHTML;

    // on click (mousedown, mouseup doesn't seem to work)
    elem.addEventListener("click", function() {
      if(event.target != this.children[0] || (todrag && todrag != this)) return;

      // if newly dragged, set styles
      if(!todrag) {
        this.classList.add("dragged");
        todrag = this;
        if(this.nextElementSibling)
          this.nextElementSibling.style.marginTop = todrag.clientHeight + (this == reorderable.item(0) ? 2 : 4) + "px";

      // if stopping drag, set position if necessary
      } else {

        // clear margins and get nearest
        for(elem of reorderableArr)
          elem.style.marginTop = "0";
        var nearest = getNearest();

        // move element if necessary
        if(nearest != Array.from(reorderable).indexOf(this))
          container.insertBefore(this, reorderable.item(nearest));

        // reset todrag
        todrag = null;
        this.classList.remove("dragged");
        this.style.top = "auto";
      }
    });
  }

  // if click outside the box while drag, cancel dragging
  document.addEventListener("click", function(event) {
    if(todrag && Array.from(document.getElementsByClassName("handle")).indexOf(event.target) == -1)
      todrag.children[0].dispatchEvent(new Event("click", { bubbles: true }));
  });

  // public instance method toArray(). Returns list of values as array
  this.toArray = function() {
    var values = [];
    for(elem of Array.from(reorderable))
      values.push(elem.textContent);
    return values;
  };

  // public instance method lock(). Locks element by hiding .handle elements
  this.lock = function() {
    if(locked) return;
    for(handle of Array.from(document.getElementsByClassName("handle")))
      handle.classList.add("locked");
    locked = true;
  };

  // public instance method unlock(). Unlocks element by showing .handle elements
  this.unlock = function() {
    if(!locked) return;
    for(handle of Array.from(document.getElementsByClassName("handle")))
      handle.classList.remove("locked");
    locked = false;
  };

  // public instance method lockToggle(). Toggles visibility of .handle elements
  this.lockToggle = function() {
    for(handle of Array.from(document.getElementsByClassName("handle")))
      handle.classList.toggle("locked");
    locked = !locked;
  };

};

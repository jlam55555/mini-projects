var Reorderable = function(container) {
  var reorderable = container.children;
  var reorderableArr = Array.from(reorderable);
  var todrag; 
  var getNearest = function() {
    return Math.round((event.pageY - container.offsetTop) / container.clientHeight * reorderable.length);
  };
  var getYCoor = function(y) {
    return y < container.offsetTop ? 0 : y > container.offsetTop + container.clientHeight ? container.clientHeight : y - container.offsetTop;
  };
  document.body.addEventListener("mousemove", function(event) {
    if(!todrag) return;
    todrag.style.top = getYCoor(event.pageY)-10 + "px";
    console.log(todrag.style.top);
    var nearest = getNearest(); 
    for(elem of reorderableArr)
      elem.style.marginTop = "0";
    if(reorderable.item(nearest) == todrag)
      reorderable.item(nearest+1).style.marginTop = todrag.clientHeight + 10 + "px";
    else if(nearest >= 0 && nearest < reorderable.length)
      reorderable.item(nearest).style.marginTop = todrag.clientHeight + 10 + "px";
  });
  for(elem of reorderableArr) {
    elem.addEventListener("click", function() {
      if(todrag && todrag != this) return;
      if(!todrag) {
        this.style.position = "absolute";
        todrag = this;
        if(this.nextSibling)
          this.nextElementSibling.style.marginTop = todrag.clientHeight + 10 + "px";
      } else {
        this.style.position = "static";
        this.style.top = "auto";
        todrag = null;
        var nearest = getNearest();
        console.log(reorderable.item(nearest).textContent, reorderable.item(nearest).style.marginTop);
        if(nearest != reorderableArr.indexOf(this))
          container.insertBefore(this, reorderable.item(nearest));
        for(elem of reorderableArr)
          elem.style.marginTop = "0";
      }
    });
  }
  document.addEventListener("click", function() {
    if(todrag) {
      //todrag.dispatchEvent(new Event("click"));
    }
  });
};
window.onload = function() {
  new Reorderable(document.getElementById("list"));
};

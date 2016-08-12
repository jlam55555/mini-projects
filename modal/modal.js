/**
 * Returns a Modal object
 * @param root:   An HTML node to be used as the modal root element. Will be removed from DOM.
 * @param width:  (optional) Width in pixels of modal. Defaults to 300px.
 * @param height: (optional) Height in pixels of modal. Defaults to 150px.
 * @param onclose:(optional) Close function callback.
 */
var Modal = function(root, width, height, onclose) {

  // set elements and default dimensions if not specified (allows change of value)
  var r = root;
  var w = width || 300;
  var h = height || 150;
  var c = onclose || function(){};
  var modalCover;

  // private function to create menu and buttons; can be changed for subclasses
  var createButtons = function(context, menu) {
    var closeButton = document.createElement("button");
    closeButton.appendChild(document.createTextNode("Close"));
    closeButton.classList.add("modalCloseButton");
    closeButton.addEventListener("click", context.hide );
    menu.appendChild(closeButton);
  };

  /**
   * Creates a modal object
   * @param element: An HTML node to be made into a modal
   */
  this.init = function(element) {
    if(element != r)
      r.classList.remove("modal");
    r = element;
    r.classList.add("modal");
    r.style.width = w + "px";
    r.style.height = h + "px";
    r.style.top = (window.innerHeight - h) / 2 + "px";
    r.style.left = (window.innerWidth - w) / 2 + "px";
    element.remove();

    // create modalCover with modal and menu
    modalCover = document.createElement("div");
    modalCover.classList.add("modalCover");
    modalCover.appendChild(r);
    var modalMenu = document.createElement("div");
    modalMenu.classList.add("modalMenu");
    r.appendChild(modalMenu);
    createButtons(this, modalMenu);
  };

  /**
   * Shows the modal
   */
  this.show = function() {
    document.body.appendChild(modalCover);
  };

  /**
   * Runs the callback, then deletes the modal. (Note the order)
   */
  this.hide = function() {
    c();
    modalCover.remove();    
  };

  // create element
  this.init(r);
};

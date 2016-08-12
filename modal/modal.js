/**
 * Returns a Modal object
 * @param root:   An HTML node to be used as the modal root element. Will be removed from DOM.
 * @param width:  (optional) Width in pixels of modal. Defaults to 300px.
 * @param height: (optional) Height in pixels of modal. Defaults to 150px.
 * @param onclose:(optional) Close function callback.
 */
var Modal = function(root, width, height, onclose) {

  // set elements and default dimensions if not specified (allows change of value)
  this.r = root;
  this.w = width || 300;
  this.h = height || 150;
  this.c = onclose || function(){};
  this.modalCover;

  /**
   * Appends any menu buttons to the modal. Can be changed for subclasses.
   * @param context: the context to run any events on for the buttons
   * @param menu:    the menu to append the buttons to
   */
  this.createButtons = function(context, menu) {
    var closeButton = document.createElement("button");
    closeButton.appendChild(document.createTextNode("Close"));
    closeButton.classList.add("modalMenuButton");
    closeButton.addEventListener("click", context.hide);
    menu.appendChild(closeButton);
  };

  /**
   * Creates a modal object
   * @param element: An HTML node to be made into a modal
   */
  this.init = function(element) {
    if(element != this.r)
      this.r.classList.remove("modal");
    this.r = element;
    this.r.classList.add("modal");
    this.r.style.width = this.w + "px";
    this.r.style.height = this.h + "px";
    this.r.style.top = (window.innerHeight - this.h) / 2 + "px";
    this.r.style.left = (window.innerWidth - this.w) / 2 + "px";
    element.remove();

    // create modalCover with modal and menu
    this.modalCover = document.createElement("div");
    this.modalCover.classList.add("modalCover");
    this.modalCover.appendChild(this.r);
    var modalMenu = document.createElement("div");
    modalMenu.classList.add("modalMenu");
    this.r.appendChild(modalMenu);
    this.createButtons(this, modalMenu);
  };

  /**
   * Shows the modal
   */
  this.show = function() {
    document.body.appendChild(this.modalCover);
  };

  /**
   * Runs the callback, then deletes the modal. (Note the order)
   * `thisContext` is used to maintain the correct `this` context.
   */
  var thisContext = this;
  this.hide = function() {
    thisContext.c();
    thisContext.modalCover.remove();
  };

  // create element
  this.init(this.r);
};

/**
 * Returns a ConfirmModal object (subclass of Modal with specific Okay/Cancel buttons and related callbacks);
 * @param root:     An HTML node to be used as the modal root element. Will be removed from DOM.
 * @param width:    (optional) Width in pixels of modal. Defaults to 300px.
 * @param height:   (optional) Height in pixels of modal. Defaults to 150px.
 * @param onok:     (optional) "Ok" button callback.
 * @param oncancel: (optional) "Cancel" button callback.
 */
var ConfirmModal = function(root, width, height, onok, oncancel) {

  // initialize from Modal, as well as onok and oncancel fields
  Modal.call(this, root, width, height);
  this.o = onok || function(){};
  this.c = oncancel || function(){};

  // change the buttons
  this.createButtons = function(context, menu) {
    var cancelButton = document.createElement("button");
    cancelButton.appendChild(document.createTextNode("Cancel"));
    cancelButton.classList.add("modalMenuButton");
    cancelButton.addEventListener("click", context.cancel);
    menu.appendChild(cancelButton);
    var okButton = document.createElement("button");
    okButton.appendChild(document.createTextNode("Ok"));
    okButton.classList.add("modalMenuButton");
    okButton.addEventListener("click", context.ok);
    menu.appendChild(okButton);
  };

  /**
   * Cancel event handler. Runs this.c() before closing.
   * Remember to define correct `this` context (because `this` will default the event target).
   */
  var thisContext = this;
  this.cancel = function() {
    thisContext.c();
    thisContext.modalCover.remove();
  };

  /**
   * Ok event handler. Runs this.o() before closing.
   */
  this.ok = function() {
    thisContext.o();
    thisContext.modalCover.remove();
  };

  // re-init to update the buttons
  this.init(this.r);
};

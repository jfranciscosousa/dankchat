$(function () {
  let FADE_TIME = 150; // ms
  let TYPING_TIMER_LENGTH = 400; // ms
  let COLORS = [
    "#e21400", "#91580f", "#f8a700", "#f78b00",
    "#58dc00", "#287b00", "#a8f07a", "#4ae8c4",
    "#3b88eb", "#3824aa", "#a700ff", "#d300e7"
  ];

    // Initialize varibles
  let $window = $(window);
  let $usernameInput = $("#usernameInput"); // Input for username
  let $passwordInput = $("#passwordInput"); // Input for password
  let $messages = $(".messages"); // Messages area
  let $inputMessage = $("#inputMessage"); // Input message input box
  let $errorMessage = $("#errorMessage");
  let $userList = $("#userList");
  let $youtube = $("#youtube");

  let $loginPage = $(".login.page"); // The login page
  let $chatPage = $(".chat.page"); // The chatroom page

    // Prompt for setting a username
  let username;
  let connected = false;
  let typing = false;
  let lastTypingTime;
  let $currentInput = $usernameInput.focus();

  let socket = io();

    // Sets the client's username
  function setUsername() {
    username = cleanInput($usernameInput.val().trim());
    let password = $passwordInput.val();
        // If the username is valid
    if (username) {
      $currentInput = $inputMessage.focus();
            // Tell the server your username
      socket.emit("auth user", {
        username: username,
        password: password
      });
    }
  }

    // Sends a chat message
  function sendMessage() {
    let message = $inputMessage.val();
        // Prevent markup from being injected into the message
    message = cleanInput(message);
        // if there is a non-empty message and a socket connection
    if (message && connected) {
      $inputMessage.val("");
      addChatMessage({
        username: username,
        message: message
      });
            // tell server to execute 'new message' and send along one parameter
      socket.emit("new message", message);
    }
  }

    // Log a message
  function log(message, options) {
    let $el = $("<li>").addClass("log").text(message);
    addMessageElement($el, options);
  }

    // Adds the visual chat message to the message list
  function addChatMessage(data, options) {
    if (data.message.startsWith("/music")) {
      let args = data.message.split(" ");
      playYoutubeAudio(args[1]);
      $inputMessage.val("");
      return;
    } else if (data.message.startsWith("/CARALHO")) {
      playYoutubeAudio("MCUq2IuY6mw");
      $inputMessage.val("");
      return;
    }
        // Don't fade the message in if there is an 'X was typing'
    let $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    let d = new Date();
    options = {
      hour: "2-digit",
      minute: "2-digit"
    };

    let $usernameDiv = $("<span class=\"username\"/>")
            .text("[" + d.toLocaleTimeString("pt-PT", options) + "] " + data.username)
            .css("color", getUsernameColor(data.username));

    data.message = Autolinker.link(data.message, {
      className: "myLink"
    });

    let $messageBodyDiv = $("<div class=\"messageBody\">")
            .html(data.message);

    let $separator = $("<span>")
            .text(":")
            .css("color", "black");

    $usernameDiv.append($separator);

    let typingClass = data.typing ? "typing" : "";

    let $messageDiv = $("<li class=\"message\"/>")
            .data("username", data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

    $messageDiv.kappa();

    addMessageElement($messageDiv, options);
  }

    /* Adds the visual chat typing message
    function addChatTyping(data) {
        data.typing = true;
        data.message = "is typing";
        addChatMessage(data);
    }*/

    // Removes the visual chat typing message
  function removeChatTyping(data) {
    getTypingMessages(data).fadeOut(() => {
      $(this).remove();
    });
  }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
  function addMessageElement(el, options) {
    let $el = $(el);

        // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === "undefined") {
      options.fade = true;
    }
    if (typeof options.prepend === "undefined") {
      options.prepend = false;
    }

        // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

    // Prevents input from having injected markup
  function cleanInput(input) {
    return $("<div/>").text(input).text();
  }

    // Updates the typing event
  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(() => {
        let typingTimer = (new Date()).getTime();
        let timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

    // Gets the 'X is typing' messages of a user
  function getTypingMessages(data) {
    return $(".typing.message").filter(() => {
      return $(this).data("username") === data.username;
    });
  }

    // Gets the color of a username through our hash function
  function getUsernameColor(username) {
        // Compute hash code
    let hash = 7;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
        // Calculate color
    let index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }

  function hasWhiteSpace(s) {
    return s.indexOf(" ") >= 0;
  }

  function playYoutubeAudio(youtubeID) {
    let aux = "<iframe width=\"300\" height=\"300\" src=\"https://www.youtube.com/embed/youtubeID?autoplay=1\">";
    aux = aux.replace("youtubeID", youtubeID);
    $youtube.html(aux);
  }

    // Keyboard events

  $window.keydown((event) => {
        // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey) && username) {
      $currentInput.focus();
    }
        // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        typing = false;
      } else {
        if (hasWhiteSpace($usernameInput.val())) {
          window.alert("No spaces allowed!");
        } else {
          setUsername();
        }
      }
    }
  });

  let playNotif = false;

  window.onfocus = function () {
    playNotif = false;
  };

  window.onblur = function () {
    playNotif = true;
  };

  $inputMessage.on("input", () => {
    updateTyping();
  });

  $passwordInput.click(() => {
    $passwordInput.focus();
  });

    // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

    // Whenever the server emits 'login', log the login message
  socket.on("login", (data) => {
        //show the chat room to the user
    $loginPage.fadeOut();
    $chatPage.show();
    $loginPage.off("click");
        //set him as logged in
    connected = true;
        // Display the welcome message
    for (let i = 0; i < data.loggedUsers.length; i++) {
      if (data.loggedUsers[i] == username) {
        $userList.append($("<li class=\"list-group-item active\">").attr("id", data.loggedUsers[i]).text(data.loggedUsers[i]));
      } else {
        $userList.append($("<li class=\"list-group-item\">").attr("id", data.loggedUsers[i]).text(data.loggedUsers[i]));
      }
    }
  });

  socket.on("login-fail", (data) => {
    $errorMessage.text(data.reason);
    username = null;
  });

    // Whenever the server emits 'new message', update the chat body
  socket.on("new message", (data) => {
    addChatMessage(data);
    let notif = document.getElementById("notif");
    notif.volume = 1;
    if (playNotif) notif.play();
  });

    // Whenever the server emits 'user joined', log it in the chat body
  socket.on("user joined", (data) => {
    log(data.username + " joined");
    if (username)
      $userList.append($("<li class=\"list-group-item\">").attr("id", data.username).text(data.username));
  });

    // Whenever the server emits 'user left', log it in the chat body
  socket.on("user left", (data) => {
    log(data.username + " left");
    $("#" + data.username).remove();
    removeChatTyping(data);
  });
});

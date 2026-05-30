(function () {
  var root = document.documentElement;
  var toggle = document.getElementById("themeToggle");
  var year = document.getElementById("year");
  var mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function systemTheme() {
    return mediaQuery.matches ? "dark" : "light";
  }

  function savedTheme() {
    try {
      return localStorage.getItem("portfolio-theme");
    } catch (error) {
      return null;
    }
  }

  function setTheme(theme, source) {
    root.dataset.theme = theme;
    root.dataset.themeSource = source;
    if (toggle) {
      toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
  }

  setTheme(savedTheme() || systemTheme(), savedTheme() ? "user" : "system");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("portfolio-theme", nextTheme);
      } catch (error) {
        // Continue without persistence when storage is unavailable.
      }
      setTheme(nextTheme, "user");
    });
  }

  function handleSystemThemeChange() {
    if (!savedTheme()) {
      setTheme(systemTheme(), "system");
    }
  }

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemThemeChange);
  }

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  var chatWidget = document.getElementById("chatWidget");
  var chatProxyUrl = chatWidget ? (chatWidget.getAttribute("data-proxy-url") || "").replace(/\/+$/, "") : "";

  if (chatWidget && chatProxyUrl && window.fetch) {
    var chatLauncher = document.getElementById("chatLauncher");
    var chatPanel = document.getElementById("chatPanel");
    var chatClose = document.getElementById("chatClose");
    var chatForm = document.getElementById("chatForm");
    var chatInput = document.getElementById("chatInput");
    var chatMessages = document.getElementById("chatMessages");
    var chatStatus = document.getElementById("chatStatus");
    var chatFallback = document.getElementById("chatFallback");
    var chatHistory = [];
    var warmupPromise = null;
    var proxyReadyAt = 0;
    var proxyReadyTtlMs = 4 * 60 * 1000;

    chatWidget.hidden = false;

    function setChatStatus(message, busy) {
      if (!chatStatus) {
        return;
      }
      chatStatus.textContent = message || "";
      chatStatus.classList.toggle("is-busy", Boolean(busy));
    }

    function setChatFallback(visible) {
      if (chatFallback) {
        chatFallback.hidden = !visible;
      }
    }

    function setChatDisabled(disabled) {
      if (chatInput) {
        chatInput.disabled = disabled;
      }
      if (chatForm) {
        var button = chatForm.querySelector("button");
        if (button) {
          button.disabled = disabled;
        }
      }
    }

    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }

    function fetchWithTimeout(url, options, timeoutMs) {
      if (!window.AbortController) {
        return fetch(url, options);
      }

      var controller = new AbortController();
      var timer = window.setTimeout(function () {
        controller.abort();
      }, timeoutMs);

      return fetch(url, Object.assign({}, options, { signal: controller.signal })).finally(function () {
        window.clearTimeout(timer);
      });
    }

    function appendChatMessage(role, content) {
      if (!chatMessages) {
        return;
      }

      var message = document.createElement("p");
      message.className = "chat-message chat-message--" + role;
      message.textContent = content;
      chatMessages.appendChild(message);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function trimChatHistory() {
      if (chatHistory.length > 10) {
        chatHistory = chatHistory.slice(-10);
      }
    }

    function waitForProxy() {
      if (proxyReadyAt && Date.now() - proxyReadyAt < proxyReadyTtlMs) {
        return Promise.resolve(true);
      }

      if (warmupPromise) {
        return warmupPromise;
      }

      var attempts = [
        { label: "Waking the chat service, this may take up to a minute.", delay: 0, timeout: 2500 },
        { label: "Still waking the chat service...", delay: 900, timeout: 6000 },
        { label: "Still waking the chat service...", delay: 1600, timeout: 10000 },
        { label: "Almost ready...", delay: 2400, timeout: 15000 },
        { label: "Still trying...", delay: 3200, timeout: 20000 }
      ];

      warmupPromise = attempts
        .reduce(function (chain, attempt, index) {
          return chain.catch(function () {
            return sleep(attempt.delay)
              .then(function () {
                setChatStatus(attempt.label, true);
                return fetchWithTimeout(chatProxyUrl + "/health", { cache: "no-store" }, attempt.timeout);
              })
              .then(function (response) {
                if (!response.ok) {
                  throw new Error("Health check failed.");
                }
                proxyReadyAt = Date.now();
                setChatStatus("", false);
                setChatFallback(false);
                return true;
              })
              .catch(function (error) {
                if (index === attempts.length - 1) {
                  throw error;
                }
                throw error;
              });
          });
        }, Promise.reject(new Error("Starting health checks.")))
        .catch(function (error) {
          setChatStatus("Chat is taking longer than expected. Please try again in a moment.", false);
          setChatFallback(true);
          throw error;
        })
        .finally(function () {
          warmupPromise = null;
        });

      return warmupPromise;
    }

    function prewarmProxy() {
      waitForProxy().catch(function () {
        // Keep the background warmup silent; the chat panel can retry when opened.
      });
    }

    function setChatOpen(open) {
      if (!chatPanel || !chatLauncher) {
        return;
      }

      chatPanel.hidden = !open;
      chatWidget.classList.toggle("is-open", open);
      chatLauncher.setAttribute("aria-expanded", open ? "true" : "false");
      chatLauncher.setAttribute("aria-label", open ? "Close chat" : "Open chat");

      if (open) {
        waitForProxy().catch(function () {
          // The submit path will surface the retryable error if the user sends a message.
        });
        window.setTimeout(function () {
          if (chatInput) {
            chatInput.focus();
          }
        }, 60);
      }
    }

    if (chatLauncher) {
      chatLauncher.addEventListener("click", function () {
        setChatOpen(chatPanel ? chatPanel.hidden : true);
      });
    }

    if (chatClose) {
      chatClose.addEventListener("click", function () {
        setChatOpen(false);
      });
    }

    if (chatForm && chatInput) {
      chatForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var content = chatInput.value.trim();
        if (!content) {
          return;
        }

        chatInput.value = "";
        appendChatMessage("user", content);
        chatHistory.push({ role: "user", content: content });
        trimChatHistory();
        setChatDisabled(true);

        waitForProxy()
          .then(function () {
            setChatStatus("Thinking...", true);
            return fetchWithTimeout(
              chatProxyUrl + "/api/chat",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ messages: chatHistory })
              },
              70000
            );
          })
          .then(function (response) {
            return response
              .json()
              .catch(function () {
                return {};
              })
              .then(function (data) {
                if (!response.ok) {
                  throw new Error(data.message || data.error || "Chat request failed.");
                }
                return data;
              });
          })
          .then(function (data) {
            var reply = data.reply || "I could not generate a response.";
            appendChatMessage("assistant", reply);
            chatHistory.push({ role: "assistant", content: reply });
            trimChatHistory();
            setChatStatus("", false);
          })
          .catch(function () {
            appendChatMessage("assistant", "I could not reach the chat service. Please try again in a moment.");
            setChatFallback(true);
            setChatStatus("", false);
          })
          .finally(function () {
            setChatDisabled(false);
            chatInput.focus();
          });
      });
    }

    prewarmProxy();
  }
})();

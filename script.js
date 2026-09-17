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
      toggle.title = toggle.getAttribute("aria-label");
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

  var siteHeader = document.querySelector(".site-header");
  var navSectionLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-target]"));
  var navSectionIds = ["work", "experience", "research", "open-source", "events", "media-coverage", "about", "outside-work", "contact"];
  var navSections = navSectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  var navMore = document.querySelector(".nav-more");
  var navMoreToggle = document.getElementById("navMoreToggle");
  var navMoreMenu = document.getElementById("navMoreMenu");
  var navMoreLinks = navMoreMenu
    ? Array.prototype.slice.call(navMoreMenu.querySelectorAll("a, button"))
    : [];
  var navMobileQuery = window.matchMedia("(max-width: 620px)");
  var navUpdateFrame = null;

  function setNavMoreOpen(open, focusFirstItem) {
    if (!navMoreToggle || !navMoreMenu) {
      return;
    }

    navMoreToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navMoreMenu.hidden = !open;

    if (open && focusFirstItem && navMoreLinks[0]) {
      navMoreLinks[0].focus();
    }
  }

  function closeNavMore(restoreFocus) {
    if (!navMoreToggle || navMoreToggle.getAttribute("aria-expanded") !== "true") {
      return;
    }

    setNavMoreOpen(false, false);
    if (restoreFocus) {
      navMoreToggle.focus();
    }
  }

  if (navMoreToggle && navMoreMenu) {
    navMoreToggle.addEventListener("click", function () {
      var willOpen = navMoreToggle.getAttribute("aria-expanded") !== "true";
      setNavMoreOpen(willOpen, false);
    });

    navMoreToggle.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeNavMore(true);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setNavMoreOpen(true, true);
      }
    });

    navMoreMenu.addEventListener("keydown", function (event) {
      var availableLinks = navMoreLinks.filter(function (link) { return !link.hidden; });
      var currentIndex = availableLinks.indexOf(document.activeElement);
      var nextIndex = currentIndex;

      if (event.key === "Escape") {
        event.preventDefault();
        closeNavMore(true);
        return;
      }

      if (event.key === "ArrowDown") {
        nextIndex = (currentIndex + 1) % availableLinks.length;
      } else if (event.key === "ArrowUp") {
        nextIndex = (currentIndex - 1 + availableLinks.length) % availableLinks.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = availableLinks.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      availableLinks[nextIndex].focus();
    });

    navMoreLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (!link.hasAttribute("data-open-chat")) {
          closeNavMore(false);
        }
      });
    });

    navMore.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!navMore.contains(document.activeElement)) {
          closeNavMore(false);
        }
      }, 0);
    });

    document.addEventListener("pointerdown", function (event) {
      if (navMoreToggle.getAttribute("aria-expanded") === "true" && !navMore.contains(event.target)) {
        closeNavMore(false);
      }
    });
  }

  function updateActiveNavigation() {
    navUpdateFrame = null;
    if (!navSections.length) {
      return;
    }

    var headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
    root.style.setProperty("--header-height", headerHeight + "px");
    var marker = headerHeight + Math.min(window.innerHeight * 0.28, 220);
    var activeSectionId = "";

    navSections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= marker) {
        activeSectionId = section.id;
      }
    });

    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      activeSectionId = "contact";
    }

    navSectionLinks.forEach(function (link) {
      var active = link.getAttribute("data-nav-target") === activeSectionId;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });

    if (navMoreToggle) {
      var moreActiveLink = navMoreLinks.find(function (link) {
        return link.getAttribute("data-nav-target") === activeSectionId;
      });
      var moreIsActive = Boolean(moreActiveLink);
      var moreSectionName = moreActiveLink ? moreActiveLink.textContent.trim() : "";
      navMoreToggle.classList.toggle("is-active", moreIsActive);
      if (moreIsActive) {
        navMoreToggle.setAttribute("aria-label", "More, current section: " + moreSectionName);
        navMoreToggle.setAttribute("aria-current", "location");
      } else {
        navMoreToggle.removeAttribute("aria-label");
        navMoreToggle.removeAttribute("aria-current");
      }
    }
  }

  function scheduleActiveNavigationUpdate() {
    if (navUpdateFrame) {
      return;
    }
    navUpdateFrame = window.requestAnimationFrame(updateActiveNavigation);
  }

  if (navSectionLinks.length) {
    window.addEventListener("scroll", scheduleActiveNavigationUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveNavigationUpdate, { passive: true });
    window.addEventListener("hashchange", scheduleActiveNavigationUpdate);
    updateActiveNavigation();
  }

  function handleNavBreakpointChange() {
    closeNavMore(false);
    scheduleActiveNavigationUpdate();
  }

  if (navMobileQuery.addEventListener) {
    navMobileQuery.addEventListener("change", handleNavBreakpointChange);
  } else if (navMobileQuery.addListener) {
    navMobileQuery.addListener(handleNavBreakpointChange);
  }

  var impactProjectsDialog = document.getElementById("impactProjectsDialog");
  var impactProjectsOpen = document.getElementById("impactProjectsOpen");
  var impactProjectsClose = document.getElementById("impactProjectsClose");
  if (impactProjectsDialog && impactProjectsOpen && impactProjectsClose) {
    impactProjectsOpen.addEventListener("click", function () {
      impactProjectsDialog.showModal();
    });
    impactProjectsClose.addEventListener("click", function () {
      impactProjectsDialog.close();
    });
    impactProjectsDialog.addEventListener("click", function (event) {
      var bounds = impactProjectsDialog.getBoundingClientRect();
      if (event.target === impactProjectsDialog &&
          (event.clientX < bounds.left || event.clientX > bounds.right ||
           event.clientY < bounds.top || event.clientY > bounds.bottom)) {
        impactProjectsDialog.close();
      }
    });
    impactProjectsDialog.addEventListener("close", function () {
      impactProjectsOpen.focus({ preventScroll: true });
    });
  }

  var eventCarousel = document.getElementById("eventCarousel");

  if (eventCarousel) {
    var eventSlides = Array.prototype.slice.call(eventCarousel.querySelectorAll(".event-carousel__slide"));
    var eventDots = Array.prototype.slice.call(eventCarousel.querySelectorAll(".event-carousel__dots button"));
    var eventPrev = eventCarousel.querySelector(".event-carousel__control--prev");
    var eventNext = eventCarousel.querySelector(".event-carousel__control--next");
    var eventToggle = eventCarousel.querySelector("#eventCarouselToggle");
    var eventCount = document.getElementById("eventCarouselCount");
    var eventIndex = 0;
    var eventTimer = null;
    var eventMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Slideshow is paused by default; users can opt in with the play control.
    var eventIsPlaying = false;
    var eventGallery = eventCarousel.closest("details");

    function setEventSlide(nextIndex) {
      if (!eventSlides.length) {
        return;
      }

      eventIndex = (nextIndex + eventSlides.length) % eventSlides.length;
      if (eventCount) {
        eventCount.textContent = (eventIndex + 1) + " / " + eventSlides.length;
      }

      eventSlides.forEach(function (slide, index) {
        var active = index === eventIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      eventDots.forEach(function (dot, index) {
        var active = index === eventIndex;
        dot.classList.toggle("is-active", active);
        if (active) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
    }

    function stopEventCarousel() {
      if (eventTimer) {
        window.clearInterval(eventTimer);
        eventTimer = null;
      }
    }

    function updateEventToggle() {
      if (!eventToggle) {
        return;
      }

      eventToggle.classList.toggle("is-paused", !eventIsPlaying);
      eventToggle.setAttribute("aria-pressed", eventIsPlaying ? "true" : "false");
      eventToggle.setAttribute("aria-label", eventIsPlaying ? "Pause event slideshow" : "Play event slideshow");
    }

    function startEventCarousel() {
      stopEventCarousel();
      if (!eventIsPlaying || eventSlides.length < 2 || document.hidden || (eventGallery && !eventGallery.open)) {
        return;
      }
      eventTimer = window.setInterval(function () {
        setEventSlide(eventIndex + 1);
      }, 5200);
    }

    function setEventPlayback(playing) {
      eventIsPlaying = playing;
      updateEventToggle();
      if (playing) {
        startEventCarousel();
      } else {
        stopEventCarousel();
      }
    }

    if (eventPrev) {
      eventPrev.addEventListener("click", function () {
        setEventSlide(eventIndex - 1);
        setEventPlayback(false);
      });
    }

    if (eventNext) {
      eventNext.addEventListener("click", function () {
        setEventSlide(eventIndex + 1);
        setEventPlayback(false);
      });
    }

    eventDots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        setEventSlide(index);
        setEventPlayback(false);
      });
    });

    if (eventToggle) {
      eventToggle.addEventListener("click", function () {
        setEventPlayback(!eventIsPlaying);
      });
    }

    eventCarousel.addEventListener("mouseenter", stopEventCarousel);
    eventCarousel.addEventListener("mouseleave", startEventCarousel);
    eventCarousel.addEventListener("focusin", stopEventCarousel);
    eventCarousel.addEventListener("focusout", startEventCarousel);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopEventCarousel();
      } else {
        startEventCarousel();
      }
    });

    if (eventMotionQuery.addEventListener) {
      eventMotionQuery.addEventListener("change", function () {
        if (eventMotionQuery.matches) { setEventPlayback(false); }
      });
    } else if (eventMotionQuery.addListener) {
      eventMotionQuery.addListener(function () {
        if (eventMotionQuery.matches) { setEventPlayback(false); }
      });
    }

    if (eventGallery) {
      eventGallery.addEventListener("toggle", function () {
        if (!eventGallery.open) setEventPlayback(false);
      });
    }

    setEventSlide(0);
    updateEventToggle();
    startEventCarousel();
  }

  var timeline = document.querySelector(".timeline");
  if (timeline) {
    var timelineItems = Array.prototype.slice.call(timeline.querySelectorAll(".timeline-item"));

    root.classList.add("timeline-enhanced");

    if (timelineItems[0]) {
      timelineItems[0].classList.add("is-current");
    }

    if ("IntersectionObserver" in window) {
      var timelineObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        {
          rootMargin: "0px 0px -12% 0px",
          threshold: 0.14
        }
      );

      timelineItems.forEach(function (item) {
        timelineObserver.observe(item);
      });

      var timelineCurrentObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            entry.target.__timelineRatio = entry.isIntersecting ? entry.intersectionRatio : 0;
          });

          var activeItem = timelineItems[0] || null;
          var activeRatio = 0;

          timelineItems.forEach(function (item) {
            var ratio = item.__timelineRatio || 0;
            if (ratio > activeRatio) {
              activeRatio = ratio;
              activeItem = item;
            }
          });

          timelineItems.forEach(function (item) {
            item.classList.toggle("is-current", item === activeItem);
          });
        },
        {
          rootMargin: "-20% 0px -35% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1]
        }
      );

      timelineItems.forEach(function (item) {
        timelineCurrentObserver.observe(item);
      });
    } else {
      timelineItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }
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
    var chatRestoreFocus = null;
    var chatCloseTimer = null;
    var chatMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    chatWidget.hidden = false;

    function setChatStatus(message, busy) {
      if (!chatStatus) {
        return;
      }
      chatStatus.textContent = message || "";
      chatStatus.classList.toggle("is-busy", Boolean(busy));
      if (chatMessages) {
        chatMessages.setAttribute("aria-busy", busy ? "true" : "false");
      }
      if (chatPanel) {
        chatPanel.setAttribute("aria-busy", busy ? "true" : "false");
      }
    }

    function setChatFallback(visible) {
      if (chatFallback) {
        chatFallback.hidden = !visible;
      }
    }

    function setChatDisabled(disabled) {
      chatWidget.querySelectorAll("[data-chat-prompt]").forEach(function (button) {
        button.disabled = disabled;
      });
      if (chatInput) {
        chatInput.disabled = disabled;
      }
      if (chatForm) {
        var button = chatForm.querySelector("button");
        if (button) {
          button.disabled = disabled || !chatInput.value.trim();
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
      message.setAttribute("aria-label", role === "user" ? "You" : "Portfolio assistant");
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
        { label: "Waiting for the chat service to respond...", delay: 2400, timeout: 15000 },
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
                setChatFallback(true);
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

    function finishChatClose() {
      if (!chatPanel || !chatLauncher) {
        return;
      }

      if (chatCloseTimer) {
        window.clearTimeout(chatCloseTimer);
        chatCloseTimer = null;
      }

      if (chatPanel.open && chatPanel.close) {
        chatPanel.close();
      } else {
        chatPanel.removeAttribute("open");
      }

      chatPanel.classList.remove("is-closing");
      chatWidget.classList.remove("is-open");
      chatLauncher.setAttribute("aria-expanded", "false");
      chatLauncher.setAttribute("aria-label", "Ask about my work");

      var restoreTarget = chatRestoreFocus && document.contains(chatRestoreFocus) ? chatRestoreFocus : chatLauncher;
      chatRestoreFocus = null;
      restoreTarget.focus();
    }

    function closeChat() {
      if (!chatPanel || !chatPanel.open || chatPanel.classList.contains("is-closing")) {
        return;
      }

      if (chatMotionQuery.matches) {
        finishChatClose();
        return;
      }
      chatPanel.classList.add("is-closing");
      var finished = false;
      var finish = function () {
        if (finished) {
          return;
        }
        finished = true;
        chatPanel.removeEventListener("animationend", finish);
        finishChatClose();
      };

      chatPanel.addEventListener("animationend", finish);
      chatCloseTimer = window.setTimeout(finish, chatMotionQuery.matches ? 220 : 280);
    }

    function openChat(invoker) {
      if (!chatPanel || !chatLauncher || chatPanel.open) {
        return;
      }

      chatRestoreFocus = invoker || document.activeElement;
      chatWidget.classList.add("is-open");
      chatLauncher.setAttribute("aria-expanded", "true");
      chatLauncher.setAttribute("aria-label", "Close chat");

      if (chatPanel.showModal) {
        chatPanel.showModal();
      } else {
        chatPanel.setAttribute("open", "");
      }

      waitForProxy().catch(function () {
        // The submit path will surface the retryable error if the user sends a message.
      });
      window.requestAnimationFrame(function () {
        if (chatInput && chatPanel.open) {
          if (window.matchMedia("(pointer: fine)").matches) {
            chatInput.focus();
          } else {
            chatClose.focus();
          }
        }
      });
    }

    if (chatLauncher) {
      chatLauncher.addEventListener("click", function () {
        if (chatPanel && chatPanel.open) {
          closeChat();
        } else {
          openChat(chatLauncher);
        }
      });
    }

    document.querySelectorAll("[data-open-chat]").forEach(function (button) {
      button.hidden = false;
      button.addEventListener("click", function () {
        // Return to the visible menu toggle when the popup closes.
        var invoker = navMore && navMore.contains(button) ? navMoreToggle : button;
        closeNavMore(false);
        openChat(invoker);
      });
    });

    if (chatClose) {
      chatClose.addEventListener("click", function () {
        closeChat();
      });
    }

    if (chatPanel) {
      chatPanel.addEventListener("cancel", function (event) {
        event.preventDefault();
        closeChat();
      });
    }

    if (chatForm && chatInput) {
      function updateComposer() {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 112) + "px";
        chatForm.querySelector("button").disabled = chatInput.disabled || !chatInput.value.trim();
      }
      chatInput.addEventListener("input", updateComposer);
      chatWidget.querySelectorAll("[data-chat-prompt]").forEach(function (button) {
        button.addEventListener("click", function () {
          if (!chatInput.disabled) {
            chatInput.value = button.getAttribute("data-chat-prompt");
            updateComposer();
            chatInput.focus();
          }
        });
      });

      chatInput.addEventListener("keydown", function (event) {
        if (
          event.key === "Enter" &&
          !event.shiftKey &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.isComposing
        ) {
          event.preventDefault();
          if (chatForm.requestSubmit) {
            chatForm.requestSubmit();
          } else {
            chatForm.dispatchEvent(new Event("submit", { cancelable: true }));
          }
        }
      });

      chatForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var content = chatInput.value.trim();
        if (!content || chatInput.disabled) {
          return;
        }

        chatInput.value = "";
        updateComposer();
        document.getElementById("chatWelcome").hidden = true;
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
            if (!data || typeof data.reply !== "string" || !data.reply.trim()) {
              throw new Error("Chat response was empty.");
            }
            var reply = data.reply.trim();
            appendChatMessage("assistant", reply);
            chatHistory.push({ role: "assistant", content: reply });
            trimChatHistory();
            setChatStatus("", false);
          })
          .catch(function () {
            appendChatMessage("assistant", "I could not reach the chat service. Please try again in a moment.");
            chatHistory.pop();
            chatInput.value = content;
            updateComposer();
            setChatFallback(true);
            setChatStatus("Your question is ready below. Send it again to retry.", false);
          })
          .finally(function () {
            setChatDisabled(false);
            if (chatPanel && chatPanel.open) {
              chatInput.focus();
            }
          });
      });
    }

    prewarmProxy();
  }

  function openHashDetails(hash) {
    if (!hash || hash.length < 2) return;
    var target;
    try { target = document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch (error) { return; }
    if (!target) return;
    var details = target.closest("details");
    var changed = false;
    while (details) {
      if (!details.open) { details.open = true; changed = true; }
      details = details.parentElement ? details.parentElement.closest("details") : null;
    }
    return changed ? target : null;
  }

  function revealHashDetails() {
    var target = openHashDetails(window.location.hash);
    // The browser may have resolved the hash before its disclosure was opened.
    if (target) requestAnimationFrame(function () { target.scrollIntoView({ block: "start" }); });
  }

  revealHashDetails();
  window.addEventListener("hashchange", revealHashDetails);
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href^='#']");
    if (link) openHashDetails(link.getAttribute("href"));
  });

  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("details").forEach(function (details) {
      if (typeof details.__printWasOpen !== "boolean") {
        details.__printWasOpen = details.open;
      }
      details.open = true;
    });
  });
  window.addEventListener("afterprint", function () {
    document.querySelectorAll("details").forEach(function (details) {
      if (typeof details.__printWasOpen === "boolean") {
        details.open = details.__printWasOpen;
        delete details.__printWasOpen;
      }
    });
  });
})();

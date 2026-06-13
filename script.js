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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
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

  var eventCarousel = document.getElementById("eventCarousel");

  if (eventCarousel) {
    var eventSlides = Array.prototype.slice.call(eventCarousel.querySelectorAll(".event-carousel__slide"));
    var eventDots = Array.prototype.slice.call(eventCarousel.querySelectorAll(".event-carousel__dots button"));
    var eventPrev = eventCarousel.querySelector(".event-carousel__control--prev");
    var eventNext = eventCarousel.querySelector(".event-carousel__control--next");
    var eventIndex = 0;
    var eventTimer = null;
    var eventMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function setEventSlide(nextIndex) {
      if (!eventSlides.length) {
        return;
      }

      eventIndex = (nextIndex + eventSlides.length) % eventSlides.length;

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

    function startEventCarousel() {
      stopEventCarousel();
      if (eventSlides.length < 2 || eventMotionQuery.matches) {
        return;
      }
      eventTimer = window.setInterval(function () {
        setEventSlide(eventIndex + 1);
      }, 5200);
    }

    if (eventPrev) {
      eventPrev.addEventListener("click", function () {
        setEventSlide(eventIndex - 1);
        startEventCarousel();
      });
    }

    if (eventNext) {
      eventNext.addEventListener("click", function () {
        setEventSlide(eventIndex + 1);
        startEventCarousel();
      });
    }

    eventDots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        setEventSlide(index);
        startEventCarousel();
      });
    });

    eventCarousel.addEventListener("mouseenter", stopEventCarousel);
    eventCarousel.addEventListener("mouseleave", startEventCarousel);
    eventCarousel.addEventListener("focusin", stopEventCarousel);
    eventCarousel.addEventListener("focusout", startEventCarousel);

    if (eventMotionQuery.addEventListener) {
      eventMotionQuery.addEventListener("change", startEventCarousel);
    } else if (eventMotionQuery.addListener) {
      eventMotionQuery.addListener(startEventCarousel);
    }

    setEventSlide(0);
    startEventCarousel();
  }

  var hero = document.getElementById("top");
  var heroNeuralField = document.getElementById("heroNeuralField");

  if (hero && heroNeuralField && heroNeuralField.getContext) {
    var neuralContext = heroNeuralField.getContext("2d");
    var neuralMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    var neuralFrame = null;
    var neuralWidth = 0;
    var neuralHeight = 0;
    var neuralDpr = 1;
    var neuralSeed = 1;
    var neuralNodes = [];
    var neuralLinks = [];
    var neuralPulses = [];
    var neuralTrails = [];
    var neuralPointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false,
      lastTrailAt: 0
    };

    function neuralRandom() {
      neuralSeed = (neuralSeed * 16807) % 2147483647;
      return (neuralSeed - 1) / 2147483646;
    }

    function resizeNeuralField() {
      var rect = hero.getBoundingClientRect();
      neuralWidth = Math.max(1, Math.round(rect.width));
      neuralHeight = Math.max(1, Math.round(rect.height));
      neuralDpr = Math.min(window.devicePixelRatio || 1, 2);

      heroNeuralField.width = Math.round(neuralWidth * neuralDpr);
      heroNeuralField.height = Math.round(neuralHeight * neuralDpr);
      neuralContext.setTransform(neuralDpr, 0, 0, neuralDpr, 0, 0);

      neuralPointer.x = neuralPointer.targetX || neuralWidth * 0.62;
      neuralPointer.y = neuralPointer.targetY || neuralHeight * 0.46;
      buildNeuralField();
      drawNeuralField(window.performance ? window.performance.now() : Date.now());
    }

    function buildNeuralField() {
      var area = neuralWidth * neuralHeight;
      var nodeCount = Math.round(clamp(area / 23000, 24, 64));
      var linkDistance = neuralWidth < 680 ? 118 : 168;
      var i;
      var j;

      neuralSeed = Math.max(2, Math.round(neuralWidth * 31 + neuralHeight * 17));
      neuralNodes = [];
      neuralLinks = [];
      neuralPulses = [];
      neuralTrails = [];

      for (i = 0; i < nodeCount; i += 1) {
        var rightBias = i % 5 === 0 ? 0.16 + neuralRandom() * 0.82 : neuralRandom();
        var x = rightBias * neuralWidth;
        var y = neuralRandom() * neuralHeight;

        neuralNodes.push({
          baseX: x,
          baseY: y,
          x: x,
          y: y,
          radius: 0.9 + neuralRandom() * 1.6,
          phase: neuralRandom() * Math.PI * 2,
          drift: 0.72 + neuralRandom() * 1.45,
          charge: 0
        });
      }

      for (i = 0; i < neuralNodes.length; i += 1) {
        for (j = i + 1; j < neuralNodes.length; j += 1) {
          var dx = neuralNodes[i].baseX - neuralNodes[j].baseX;
          var dy = neuralNodes[i].baseY - neuralNodes[j].baseY;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < linkDistance) {
            neuralLinks.push({ a: i, b: j, distance: distance, max: linkDistance });
          }
        }
      }

      neuralLinks.sort(function (a, b) {
        return a.distance - b.distance;
      });
      neuralLinks = neuralLinks.slice(0, Math.round(nodeCount * 2.4));

      for (i = 0; i < Math.min(18, Math.max(7, Math.round(neuralLinks.length / 5))); i += 1) {
        neuralPulses.push({
          link: neuralLinks[Math.floor(neuralRandom() * neuralLinks.length)],
          offset: neuralRandom(),
          speed: 0.000045 + neuralRandom() * 0.000075,
          radius: 1.5 + neuralRandom() * 1.4
        });
      }
    }

    function neuralPalette() {
      if (root.dataset.theme === "dark") {
        return {
          link: "rgba(114, 173, 255, ",
          node: "rgba(255, 255, 255, ",
          pulse: "rgba(255, 255, 255, ",
          trail: "rgba(114, 173, 255, ",
          accent: "rgba(118, 185, 0, "
        };
      }

      return {
        link: "rgba(11, 79, 179, ",
        node: "rgba(11, 79, 179, ",
        pulse: "rgba(255, 255, 255, ",
        trail: "rgba(23, 105, 223, ",
        accent: "rgba(23, 105, 223, "
      };
    }

    function addNeuralTrail(x, y, time) {
      if (time - neuralPointer.lastTrailAt < 42) {
        return;
      }

      neuralPointer.lastTrailAt = time;
      neuralTrails.push({
        x: x,
        y: y,
        radius: 5 + neuralRandom() * 12,
        life: 1
      });

      if (neuralTrails.length > 28) {
        neuralTrails.shift();
      }
    }

    function drawNeuralField(time) {
      var palette = neuralPalette();
      var pointerRadius = clamp(neuralWidth * 0.18, 150, 260);
      var i;

      neuralContext.clearRect(0, 0, neuralWidth, neuralHeight);
      neuralPointer.x += (neuralPointer.targetX - neuralPointer.x) * 0.08;
      neuralPointer.y += (neuralPointer.targetY - neuralPointer.y) * 0.08;

      for (i = neuralTrails.length - 1; i >= 0; i -= 1) {
        var trail = neuralTrails[i];
        var trailAlpha = trail.life * (root.dataset.theme === "dark" ? 0.2 : 0.12);
        neuralContext.beginPath();
        neuralContext.arc(trail.x, trail.y, trail.radius * (1.15 - trail.life * 0.35), 0, Math.PI * 2);
        neuralContext.strokeStyle = palette.trail + trailAlpha + ")";
        neuralContext.lineWidth = 1.1;
        neuralContext.stroke();
        trail.life -= 0.018;

        if (trail.life <= 0) {
          neuralTrails.splice(i, 1);
        }
      }

      neuralNodes.forEach(function (node) {
        var driftX = Math.cos(time * 0.00024 * node.drift + node.phase) * 4.5;
        var driftY = Math.sin(time * 0.0003 * node.drift + node.phase) * 4.5;
        var pushX = 0;
        var pushY = 0;
        node.charge = 0;

        if (neuralPointer.active) {
          var dx = node.baseX - neuralPointer.x;
          var dy = node.baseY - neuralPointer.y;
          var distance = Math.sqrt(dx * dx + dy * dy) || 1;

          if (distance < pointerRadius) {
            var force = (1 - distance / pointerRadius);
            node.charge = force;
            pushX = (dx / distance) * force * 24;
            pushY = (dy / distance) * force * 24;
          }
        }

        node.x = node.baseX + driftX + pushX;
        node.y = node.baseY + driftY + pushY;
      });

      neuralContext.lineCap = "round";

      neuralLinks.forEach(function (link) {
        var source = neuralNodes[link.a];
        var target = neuralNodes[link.b];
        var dx = source.x - target.x;
        var dy = source.y - target.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var charge = Math.max(source.charge, target.charge);
        var alpha = clamp((1 - distance / link.max) * 0.2 + charge * 0.18, 0.025, 0.34);

        neuralContext.beginPath();
        neuralContext.moveTo(source.x, source.y);
        neuralContext.lineTo(target.x, target.y);
        neuralContext.strokeStyle = palette.link + alpha + ")";
        neuralContext.lineWidth = 0.8 + charge * 0.8;
        neuralContext.stroke();
      });

      neuralPulses.forEach(function (pulse, index) {
        if (!pulse.link) {
          return;
        }

        var source = neuralNodes[pulse.link.a];
        var target = neuralNodes[pulse.link.b];
        var progress = (pulse.offset + time * pulse.speed) % 1;
        var x = source.x + (target.x - source.x) * progress;
        var y = source.y + (target.y - source.y) * progress;
        var pulseAlpha = root.dataset.theme === "dark" ? 0.74 : 0.5;

        neuralContext.beginPath();
        neuralContext.arc(x, y, pulse.radius, 0, Math.PI * 2);
        neuralContext.fillStyle = (index % 5 === 0 ? palette.accent : palette.pulse) + pulseAlpha + ")";
        neuralContext.fill();
      });

      neuralNodes.forEach(function (node) {
        var glow = 0.4 + node.charge * 0.46;
        neuralContext.beginPath();
        neuralContext.arc(node.x, node.y, node.radius + node.charge * 1.3, 0, Math.PI * 2);
        neuralContext.fillStyle = palette.node + glow + ")";
        neuralContext.fill();
      });
    }

    function animateNeuralField(time) {
      drawNeuralField(time);
      neuralFrame = window.requestAnimationFrame(animateNeuralField);
    }

    function stopNeuralField() {
      if (neuralFrame) {
        window.cancelAnimationFrame(neuralFrame);
        neuralFrame = null;
      }
    }

    function startNeuralField() {
      stopNeuralField();
      resizeNeuralField();

      if (!neuralMotionQuery.matches && !document.hidden) {
        neuralFrame = window.requestAnimationFrame(animateNeuralField);
      }
    }

    function handleNeuralPointerMove(event) {
      var rect = hero.getBoundingClientRect();
      var x = clamp(event.clientX - rect.left, 0, neuralWidth);
      var y = clamp(event.clientY - rect.top, 0, neuralHeight);
      var time = window.performance ? window.performance.now() : Date.now();

      neuralPointer.active = true;
      neuralPointer.targetX = x;
      neuralPointer.targetY = y;
      addNeuralTrail(x, y, time);
    }

    hero.addEventListener("pointerenter", function () {
      neuralPointer.active = true;
    });

    hero.addEventListener("pointermove", handleNeuralPointerMove);

    hero.addEventListener("pointerleave", function () {
      neuralPointer.active = false;
    });

    window.addEventListener("resize", startNeuralField);

    if (neuralMotionQuery.addEventListener) {
      neuralMotionQuery.addEventListener("change", startNeuralField);
    } else if (neuralMotionQuery.addListener) {
      neuralMotionQuery.addListener(startNeuralField);
    }

    if (window.MutationObserver) {
      new MutationObserver(function () {
        drawNeuralField(window.performance ? window.performance.now() : Date.now());
      }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopNeuralField();
      } else {
        startNeuralField();
      }
    });

    startNeuralField();
  }

  var timeline = document.querySelector(".timeline");

  if (timeline) {
    var timelineItems = Array.prototype.slice.call(timeline.querySelectorAll(".timeline-item"));
    var timelineTicking = false;

    root.classList.add("timeline-enhanced");

    function updateTimelineProgress() {
      var rect = timeline.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var progress = (viewportHeight * 0.72 - rect.top) / (rect.height + viewportHeight * 0.16);
      var activeItem = null;
      var activeDistance = Infinity;
      var activationY = viewportHeight * 0.48;

      timeline.style.setProperty("--timeline-progress", (clamp(progress, 0, 1) * 100).toFixed(2) + "%");

      timelineItems.forEach(function (item) {
        var itemRect = item.getBoundingClientRect();
        var itemCenter = itemRect.top + itemRect.height * 0.35;
        var distance = Math.abs(itemCenter - activationY);

        if (itemRect.bottom > viewportHeight * 0.08 && itemRect.top < viewportHeight * 0.82 && distance < activeDistance) {
          activeDistance = distance;
          activeItem = item;
        }
      });

      timelineItems.forEach(function (item) {
        item.classList.toggle("is-current", item === activeItem);
      });

      timelineTicking = false;
    }

    function requestTimelineUpdate() {
      if (!timelineTicking) {
        timelineTicking = true;
        window.requestAnimationFrame(updateTimelineProgress);
      }
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
    } else {
      timelineItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
    }

    window.addEventListener("scroll", requestTimelineUpdate, { passive: true });
    window.addEventListener("resize", requestTimelineUpdate);
    updateTimelineProgress();
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

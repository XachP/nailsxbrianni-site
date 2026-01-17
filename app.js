(() => {
  const defaultConfig = {
    brand: {
      name: "Nails x Brianni",
      tagline: "Soft glam sets with clean girl precision."
    },
    links: {
      book: "#/book",
      services: "#/services",
      collections: "#/collections",
      policies: "#/policies",
      shop: "https://www.amazon.com/shop/nailsxbrianni",
      instagram: "https://www.instagram.com/nailsxbrianni/",
      tiktok: "https://www.tiktok.com/@nailsxbrianni",
      admin: "/admin/"
    },
    booking: {
      mode: "embed",
      deposit: {
        type: "fixed",
        amount: 10,
        currency: "USD"
      },
      embed: {
        provider: "calendly",
        embedCode: "<div class=\"calendly-inline-widget\" data-url=\"https://calendly.com/zacharyplumey2001/30min?hide_event_type_details=1&hide_gdpr_banner=1\" style=\"min-width:320px;height:700px;\"></div>\n<script type=\"text/javascript\" src=\"https://assets.calendly.com/assets/external/widget.js\" async></script>",
        embedUrl: ""
      },
      custom: {
        enabled: false,
        instructions: "Requests are reviewed within 24 hours. You will receive a confirmation text."
      }
    },
    services: [
      {
        id: "gelx-short",
        name: "Gel-X Full Set (Short)",
        duration: "1h 30m",
        price: "$55+"
      },
      {
        id: "gelx-long",
        name: "Gel-X Full Set (Long)",
        duration: "2h",
        price: "$65+"
      },
      {
        id: "acrylic-full",
        name: "Acrylic Full Set",
        duration: "2h",
        price: "$60+"
      },
      {
        id: "fill-in",
        name: "Fill-In",
        duration: "1h 15m",
        price: "$40+"
      },
      {
        id: "gel-mani",
        name: "Gel Manicure",
        duration: "45m",
        price: "$30+"
      },
      {
        id: "nail-art",
        name: "Nail Art Add-On",
        duration: "20m",
        price: "$10+"
      },
      {
        id: "soak-off",
        name: "Soak Off",
        duration: "20m",
        price: "$15+"
      }
    ],
    servicesEditor: {
      enabled: true,
      pin: "brianni123"
    },
    collections: {
      editor: {
        enabled: true,
        pin: ""
      },
      categories: [
        {
          id: "soft-pink",
          label: "Soft Pink",
          images: [
            { src: "assets/collection-1.svg", alt: "Soft pink nails" },
            { src: "assets/collection-2.svg", alt: "Sheer blush nails" },
            { src: "assets/collection-3.svg", alt: "Rosy nude set" },
            { src: "assets/collection-4.svg", alt: "Glossy pink set" }
          ]
        },
        {
          id: "chrome-glow",
          label: "Chrome Glow",
          images: [
            { src: "assets/collection-2.svg", alt: "Chrome glow nails" },
            { src: "assets/collection-5.svg", alt: "Iridescent chrome set" },
            { src: "assets/collection-6.svg", alt: "Silver chrome nails" },
            { src: "assets/collection-1.svg", alt: "Shimmer finish set" }
          ]
        },
        {
          id: "french-tips",
          label: "French Tips",
          images: [
            { src: "assets/collection-3.svg", alt: "Classic french tips" },
            { src: "assets/collection-4.svg", alt: "Pink french tips" },
            { src: "assets/collection-5.svg", alt: "Micro french tips" },
            { src: "assets/collection-2.svg", alt: "Glossy french set" }
          ]
        },
        {
          id: "seasonal-pop",
          label: "Seasonal Pop",
          images: [
            { src: "assets/collection-6.svg", alt: "Seasonal nail set" },
            { src: "assets/collection-1.svg", alt: "Holiday nails" },
            { src: "assets/collection-2.svg", alt: "Spring nail set" },
            { src: "assets/collection-3.svg", alt: "Bold seasonal set" }
          ]
        }
      ]
    },
    policies: {
      deposit: "A non-refundable deposit is required to secure your appointment. Deposits apply to your total. No deposit = no appointment.",
      cancellation: "Cancel or reschedule at least 24 hours before your appointment. Late cancellations forfeit the deposit.",
      late: "There is a 10-minute grace period. After 10 minutes, your appointment may be cancelled and the deposit is forfeited.",
      noShow: "No-shows are charged 100% of the service. Future bookings require full prepayment."
    },
    testimonials: [
      {
        quote: "My set was flawless and lasted so long. The attention to detail is unmatched.",
        name: "Jada M.",
        service: "Gel-X Full Set"
      },
      {
        quote: "She understood the vibe immediately and the shape was perfect.",
        name: "Ari L.",
        service: "Acrylic Full Set"
      },
      {
        quote: "Clean, cute, and so professional. I always leave obsessed.",
        name: "Kayla R.",
        service: "Gel Manicure"
      }
    ],
    contact: {
      location: "Justice, Illinois",
      address: "Justice, IL 60458",
      email: "hello@nailsxbrianni.com",
      phone: "(404) 555-0134",
      parkingNote: "Free parking available behind the studio.",
      mapEmbedUrl: "https://www.google.com/maps?q=Justice,+IL&output=embed",
      mapLink: "https://www.google.com/maps?q=Justice,+IL"
    },
  };

  const routes = new Set(["home", "book", "services", "admin", "collections", "policies"]);
  const servicesStorageKey = "nxb_services_override";
  const servicesEditorSettingsKey = "nxb_services_editor_settings";
  const servicesEditAuthKey = "nxb_services_editor_unlocked";
  const collectionsStorageKey = "nxb_collections_override";
  const collectionsEditAuthKey = "nxb_collections_editor_unlocked";

  const state = {
    config: defaultConfig,
    servicesEditor: {
      services: [],
      show: null,
      renderList: null,
      updateView: null
    },
    collectionsEditor: {
      categories: [],
      show: null,
      renderList: null,
      updateView: null
    }
  };

  function formatCurrency(amount, currency) {
    if (typeof amount !== "number") {
      return amount || "";
    }
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD"
      }).format(amount);
    } catch (err) {
      return `$${amount}`;
    }
  }

  function depositSummary(deposit) {
    if (!deposit) {
      return "Deposit required to secure your appointment.";
    }
    if (deposit.type === "percent") {
      return `Deposit required: ${deposit.amount}% of the service total.`;
    }
    const amount = formatCurrency(deposit.amount, deposit.currency || "USD");
    return `Deposit required: ${amount} applied to your total.`;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = text || "";
    }
  }

  function setTextAll(selector, text) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = text || "";
    });
  }

  function createLinkElement(label, href, className) {
    const anchor = document.createElement("a");
    anchor.className = className;
    anchor.textContent = label;
    if (href) {
      anchor.href = href;
      if (/^https?:\/\//i.test(href)) {
        anchor.target = "_blank";
        anchor.rel = "noopener";
      }
    } else {
      anchor.href = "#";
      anchor.classList.add("disabled");
    }
    return anchor;
  }

  function createQuickLink(label, href) {
    const anchor = document.createElement("a");
    anchor.className = "quick-link";
    anchor.innerHTML = `<span class="quick-label">${label}</span><span class="quick-arrow">-></span>`;
    if (href) {
      anchor.href = href;
      if (/^https?:\/\//i.test(href)) {
        anchor.target = "_blank";
        anchor.rel = "noopener";
      }
    } else {
      anchor.href = "#";
      anchor.classList.add("disabled");
    }
    return anchor;
  }

  function cloneData(value, fallback) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (err) {
      return fallback;
    }
  }

  function slugify(value) {
    return (value || "")
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  function loadServicesOverride() {
    try {
      const raw = localStorage.getItem(servicesStorageKey);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function saveServicesOverride(services) {
    const payload = {
      services: normalizeServices(services),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(servicesStorageKey, JSON.stringify(payload));
  }

  function clearServicesOverride() {
    localStorage.removeItem(servicesStorageKey);
  }

  function loadServicesEditorSettings() {
    try {
      const raw = localStorage.getItem(servicesEditorSettingsKey);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function saveServicesEditorSettings(settings) {
    const payload = {
      pin: typeof settings.pin === "string" ? settings.pin : ""
    };
    localStorage.setItem(servicesEditorSettingsKey, JSON.stringify(payload));
  }

  function getServicesData(config) {
    const override = loadServicesOverride();
    if (override && Array.isArray(override.services)) {
      return normalizeServices(override.services);
    }
    return normalizeServices(config.services || []);
  }

  function getServicesEditorConfig(config) {
    const editor = config.servicesEditor || {};
    const override = loadServicesEditorSettings();
    if (override && Object.prototype.hasOwnProperty.call(override, "pin")) {
      return { ...editor, pin: override.pin };
    }
    return editor;
  }

  function loadCollectionsOverride() {
    try {
      const raw = localStorage.getItem(collectionsStorageKey);
      if (!raw) {
        return null;
      }
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function saveCollectionsOverride(categories) {
    const payload = {
      categories: normalizeCategories(categories),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(collectionsStorageKey, JSON.stringify(payload));
  }

  function clearCollectionsOverride() {
    localStorage.removeItem(collectionsStorageKey);
  }

  function getCollectionsData(config) {
    const collections = config.collections || {};
    const override = loadCollectionsOverride();
    const categories = override && Array.isArray(override.categories)
      ? override.categories
      : collections.categories || [];
    return { ...collections, categories };
  }

  function normalizeCategories(categories) {
    return (categories || []).map((category, index) => {
      const label = (category.label || `Collection ${index + 1}`).trim();
      const id = (category.id || slugify(label) || `collection-${index + 1}`).trim();
      const images = Array.isArray(category.images)
        ? category.images
            .filter(Boolean)
            .map((image) => ({
              src: image.src || "",
              alt: image.alt || label,
              caption: image.caption || ""
            }))
            .filter((image) => image.src)
        : [];
      return {
        id,
        label,
        images
      };
    });
  }

  function normalizeServices(services) {
    return (services || []).map((service, index) => {
      const name = (service.name || `Service ${index + 1}`).trim();
      const id = (service.id || slugify(name) || `service-${index + 1}`).trim();
      return {
        id,
        name,
        duration: service.duration || "",
        price: service.price || "",
        description: service.description || "",
        featured: Boolean(service.featured)
      };
    });
  }

  function syncServicesEditorState(config) {
    state.servicesEditor.services = cloneData(
      getServicesData(config),
      []
    );
  }

  function syncCollectionsEditorState(config) {
    state.collectionsEditor.categories = cloneData(
      getCollectionsData(config).categories || [],
      []
    );
  }

  function injectEmbed(container, embedCode) {
    container.innerHTML = embedCode;
    const scripts = Array.from(container.querySelectorAll("script"));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      newScript.text = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });
  }

  async function loadConfig() {
    try {
      const response = await fetch("config.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Config not found");
      }
      return await response.json();
    } catch (err) {
      console.warn("Using default config.", err);
      return defaultConfig;
    }
  }

  function fillServiceSelect(select, services) {
    if (!select) {
      return;
    }
    select.innerHTML = "";
    services.forEach((service) => {
      const option = document.createElement("option");
      const meta = [];
      if (service.duration) {
        meta.push(service.duration);
      }
      if (service.price) {
        meta.push(service.price);
      }
      option.value = service.id;
      option.textContent = meta.length ? `${service.name} (${meta.join(" - ")})` : service.name;
      select.appendChild(option);
    });
  }

  function findService(services, id) {
    return services.find((service) => service.id === id);
  }

  function renderHome(config) {
    const brand = config.brand || {};
    setTextAll("[data-brand-name]", brand.name || "Nails x Brianni");
    setTextAll("[data-brand-tagline]", brand.tagline || "");

    const links = config.links || {};
    const bookLink = links.book || "#/book";
    const navDefs = [
      { label: "Book", href: bookLink, primary: true },
      { label: "Services", href: links.services || "#/services" },
      { label: "Collections", href: links.collections || "#/collections" },
      { label: "Policies", href: links.policies || "#/policies" },
      { label: "Shop", href: links.shop || "" }
    ];
    if (links.admin) {
      navDefs.push({ label: "Admin", href: links.admin });
    }

    const mainNav = document.getElementById("mainNav");
    if (mainNav) {
      mainNav.innerHTML = "";
      navDefs.forEach((link) => {
        const className = link.primary ? "nav-link primary" : "nav-link";
        mainNav.appendChild(createLinkElement(link.label, link.href, className));
      });
    }

    const heroCtas = document.getElementById("heroCtas");
    if (heroCtas) {
      heroCtas.innerHTML = "";
      heroCtas.appendChild(createLinkElement("Book Now", bookLink, "button-primary"));
      heroCtas.appendChild(createLinkElement("View Services", links.services || "#/services", "button-outline"));
    }

    const depositText = depositSummary(config.booking && config.booking.deposit);
    const mobileBookCta = document.getElementById("mobileBookCta");
    if (mobileBookCta) {
      mobileBookCta.href = bookLink;
    }
    const mobileCtaSubtext = document.getElementById("mobileCtaSubtext");
    if (mobileCtaSubtext) {
      mobileCtaSubtext.textContent = depositText;
    }
    const homeDeposit = document.getElementById("homeDeposit");
    if (homeDeposit) {
      homeDeposit.innerHTML = `<p>${depositText}</p><p class="hint">No deposit = no appointment.</p>`;
    }

    const contact = config.contact || {};
    const highlightItems = [];
    if (contact.location) {
      highlightItems.push(`Based in ${contact.location}`);
    }
    if (contact.phone) {
      highlightItems.push(`Text ${contact.phone}`);
    }
    if (contact.email) {
      highlightItems.push(`Email ${contact.email}`);
    }

    const homeHighlights = document.getElementById("homeHighlights");
    if (homeHighlights) {
      const list = highlightItems.length
        ? `<ul class="highlight-list">${highlightItems.map((item) => `<li>${item}</li>`).join("")}</ul>`
        : '<p class="hint">Add your studio details in config.json.</p>';
      homeHighlights.innerHTML = `<h3>Studio Info</h3>${list}`;
    }

    const quickLinks = document.getElementById("quickLinks");
    if (quickLinks) {
      const quickDefs = [
        { label: "Shop My Nail Must-Haves", href: links.shop || "" },
        { label: "Instagram", href: links.instagram || "" },
        { label: "TikTok", href: links.tiktok || "" },
        { label: "Policies", href: links.policies || "#/policies" }
      ];
      quickLinks.innerHTML = "";
      quickDefs.forEach((link) => {
        quickLinks.appendChild(createQuickLink(link.label, link.href));
      });
    }

    const homeContact = document.getElementById("homeContact");
    if (homeContact) {
      const contactLines = [];
      if (contact.location) {
        contactLines.push(`Location: ${contact.location}`);
      }
      if (contact.address) {
        contactLines.push(`Address: ${contact.address}`);
      }
      if (contact.phone) {
        contactLines.push(`Phone: ${contact.phone}`);
      }
      if (contact.email) {
        contactLines.push(`Email: ${contact.email}`);
      }
      if (contact.parkingNote) {
        contactLines.push(`Parking: ${contact.parkingNote}`);
      }
      const linesHtml = contactLines.map((line) => `<p>${line}</p>`).join("");
      homeContact.innerHTML = `<h3>Contact</h3>${linesHtml || '<p class="hint">Add your contact details in config.json.</p>'}`;
    }

    renderHomeServices(config);
    renderHomeGallery(config);
    renderTestimonials(config);
    renderLocation(config);
  }

  function renderHomeServices(config) {
    const container = document.getElementById("homeServices");
    if (!container) {
      return;
    }
    const services = getServicesData(config);
    const featured = services.filter((service) => service.featured);
    const list = featured.length ? featured : services.slice(0, 3);
    container.innerHTML = "";
    if (!list.length) {
      container.innerHTML = '<p class="hint">Add services in config.json.</p>';
      return;
    }
    list.forEach((service) => {
      const card = document.createElement("div");
      card.className = "card service-card compact";
      const description = service.description ? `<p class="hint">${service.description}</p>` : "";
      card.innerHTML = `
        <div>
          <h3>${service.name}</h3>
          <div class="service-meta">
            <span>${service.duration || ""}</span>
            <span class="service-price">${service.price || ""}</span>
          </div>
          ${description}
        </div>
        <a class="button-outline" href="#/book?service=${encodeURIComponent(service.id)}">Book</a>
      `;
      container.appendChild(card);
    });
  }

  function renderHomeGallery(config) {
    const grid = document.getElementById("homeGallery");
    if (!grid) {
      return;
    }
    const collections = getCollectionsData(config);
    const categories = collections.categories || [];
    const images = [];
    categories.forEach((category) => {
      (category.images || []).forEach((image) => {
        images.push({ ...image, label: category.label });
      });
    });
    const preview = images.slice(0, 4);
    grid.innerHTML = "";
    if (!preview.length) {
      grid.innerHTML = '<p class="hint">Add collection images in config.json.</p>';
      return;
    }
    preview.forEach((image) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";
      const caption = image.caption ? `<figcaption>${image.caption}</figcaption>` : "";
      figure.innerHTML = `<img src="${image.src}" alt="${image.alt || image.label || "Nail set"}" loading="lazy" />${caption}`;
      grid.appendChild(figure);
    });
  }

  function renderTestimonials(config) {
    const grid = document.getElementById("testimonialsGrid");
    if (!grid) {
      return;
    }
    const testimonials = config.testimonials || [];
    grid.innerHTML = "";
    if (!testimonials.length) {
      grid.innerHTML = '<p class="hint">Add testimonials in config.json.</p>';
      return;
    }
    testimonials.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card testimonial-card";
      const name = item.name ? `<span>${item.name}</span>` : "<span>Client</span>";
      const service = item.service ? `<span>${item.service}</span>` : "<span></span>";
      card.innerHTML = `
        <div class="testimonial-quote">"${item.quote || ""}"</div>
        <div class="testimonial-meta">${name}${service}</div>
      `;
      grid.appendChild(card);
    });
  }

  function renderLocation(config) {
    const contact = config.contact || {};
    const details = document.getElementById("locationDetails");
    const map = document.getElementById("locationMap");
    const mapLink = document.getElementById("locationMapLink");
    const mapCard = map ? map.closest(".map-card") : null;

    if (details) {
      const lines = [];
      if (contact.location) {
        lines.push(`<p><strong>City:</strong> ${contact.location}</p>`);
      }
      if (contact.address) {
        lines.push(`<p><strong>Address:</strong> ${contact.address}</p>`);
      }
      if (contact.phone) {
        lines.push(`<p><strong>Text:</strong> ${contact.phone}</p>`);
      }
      if (contact.email) {
        lines.push(`<p><strong>Email:</strong> ${contact.email}</p>`);
      }
      if (contact.parkingNote) {
        lines.push(`<p><strong>Parking:</strong> ${contact.parkingNote}</p>`);
      }
      details.innerHTML = lines.join("") || '<p class="hint">Add your location details in config.json.</p>';
    }

    if (map) {
      if (contact.mapEmbedUrl) {
        map.src = contact.mapEmbedUrl;
        map.classList.remove("hidden");
        if (mapCard) {
          mapCard.classList.remove("hidden");
        }
      } else {
        map.classList.add("hidden");
        if (mapCard) {
          mapCard.classList.add("hidden");
        }
      }
    }

    if (mapLink) {
      if (contact.mapLink) {
        mapLink.href = contact.mapLink;
        mapLink.classList.remove("hidden");
      } else {
        mapLink.classList.add("hidden");
      }
    }
  }

  function renderServicesEditor(config) {
    const editorConfig = getServicesEditorConfig(config);
    const editor = document.getElementById("servicesEditor");
    const list = document.getElementById("servicesEditorList");
    const addButton = document.getElementById("servicesAddService");
    const saveButton = document.getElementById("servicesSave");
    const resetButton = document.getElementById("servicesReset");
    const status = document.getElementById("servicesEditorStatus");
    const pinInput = document.getElementById("servicesPinInput");
    const pinSave = document.getElementById("servicesPinSave");
    const pinHint = document.getElementById("servicesPinHint");

    if (!editor || !list || !addButton || !saveButton || !resetButton) {
      return;
    }

    if (!editorConfig.enabled) {
      editor.classList.add("hidden");
      return;
    }

    let currentPin = (editorConfig.pin || "").trim();

    function setStatus(message) {
      if (status) {
        status.textContent = message || "";
      }
    }

    function renderList() {
      list.innerHTML = "";
      const services = state.servicesEditor.services || [];
      if (!services.length) {
        const empty = document.createElement("p");
        empty.className = "hint";
        empty.textContent = "No services yet. Add your first service.";
        list.appendChild(empty);
        return;
      }

      services.forEach((service, index) => {
        const card = document.createElement("div");
        card.className = "card editor-service";
        card.innerHTML = `
          <div class="editor-header">
            <h3>Service ${index + 1}</h3>
            <button class="button-outline small remove-service" type="button">Remove</button>
          </div>
          <div class="editor-grid service-editor-grid">
            <div class="input-group">
              <label>Service name</label>
              <input type="text" class="service-name" placeholder="e.g. Gel-X Full Set" />
            </div>
            <div class="input-group">
              <label>Duration</label>
              <input type="text" class="service-duration" placeholder="e.g. 1h 30m" />
            </div>
            <div class="input-group">
              <label>Starting price</label>
              <input type="text" class="service-price-input" placeholder="$55+" />
            </div>
            <div class="input-group span-full">
              <label>Description (optional)</label>
              <textarea rows="2" class="service-description" placeholder="Short details"></textarea>
            </div>
          </div>
          <label class="checkbox-row">
            <input type="checkbox" class="service-featured" />
            Feature on Home
          </label>
        `;

        const nameInput = card.querySelector(".service-name");
        const durationInput = card.querySelector(".service-duration");
        const priceInput = card.querySelector(".service-price-input");
        const descriptionInput = card.querySelector(".service-description");
        const featuredInput = card.querySelector(".service-featured");

        if (nameInput) {
          nameInput.value = service.name || "";
          nameInput.addEventListener("input", () => {
            state.servicesEditor.services[index].name = nameInput.value;
          });
        }

        if (durationInput) {
          durationInput.value = service.duration || "";
          durationInput.addEventListener("input", () => {
            state.servicesEditor.services[index].duration = durationInput.value;
          });
        }

        if (priceInput) {
          priceInput.value = service.price || "";
          priceInput.addEventListener("input", () => {
            state.servicesEditor.services[index].price = priceInput.value;
          });
        }

        if (descriptionInput) {
          descriptionInput.value = service.description || "";
          descriptionInput.addEventListener("input", () => {
            state.servicesEditor.services[index].description = descriptionInput.value;
          });
        }

        if (featuredInput) {
          featuredInput.checked = Boolean(service.featured);
          featuredInput.addEventListener("change", () => {
            state.servicesEditor.services[index].featured = featuredInput.checked;
          });
        }

        const removeButton = card.querySelector(".remove-service");
        if (removeButton) {
          removeButton.addEventListener("click", () => {
            state.servicesEditor.services.splice(index, 1);
            renderList();
          });
        }

        list.appendChild(card);
      });
    }

    function unlockEditor() {
      if (!currentPin) {
        return true;
      }
      const authed = sessionStorage.getItem(servicesEditAuthKey) === "true";
      if (authed) {
        return true;
      }
      const entered = window.prompt("Enter admin password");
      if (entered !== currentPin) {
        window.alert("Incorrect password.");
        return false;
      }
      sessionStorage.setItem(servicesEditAuthKey, "true");
      return true;
    }

    function showEditor(forceOpen) {
      const isHidden = editor.classList.contains("hidden");
      if (!isHidden && !forceOpen) {
        editor.classList.add("hidden");
        return;
      }
      if (!unlockEditor()) {
        return;
      }
      syncServicesEditorState(config);
      renderList();
      editor.classList.remove("hidden");
      editor.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    state.servicesEditor.show = showEditor;
    state.servicesEditor.renderList = renderList;

    if (pinSave && !pinSave.dataset.bound) {
      pinSave.dataset.bound = "true";
      pinSave.addEventListener("click", () => {
        const newPin = pinInput ? pinInput.value.trim() : "";
        saveServicesEditorSettings({ pin: newPin });
        currentPin = newPin;
        if (state.config.servicesEditor) {
          state.config.servicesEditor.pin = newPin;
        }
        sessionStorage.removeItem(servicesEditAuthKey);
        if (pinInput) {
          pinInput.value = "";
        }
        if (pinHint) {
          pinHint.textContent = newPin
            ? "Admin PIN updated for this browser. Update config.json to publish."
            : "PIN cleared for this browser. Update config.json to publish.";
        }
        setStatus("Admin PIN updated.");
        if (state.servicesEditor.updateView) {
          state.servicesEditor.updateView();
        }
      });
    }

    if (!addButton.dataset.bound) {
      addButton.dataset.bound = "true";
      addButton.addEventListener("click", () => {
        state.servicesEditor.services.push({
          id: `service-${Date.now()}`,
          name: "New Service",
          duration: "",
          price: "",
          description: "",
          featured: false
        });
        renderList();
      });
    }

    if (!saveButton.dataset.bound) {
      saveButton.dataset.bound = "true";
      saveButton.addEventListener("click", () => {
        const normalized = normalizeServices(state.servicesEditor.services);
        state.servicesEditor.services = cloneData(normalized, []);
        saveServicesOverride(normalized);
        setStatus("Saved locally. Copy updates into config.json to publish.");
        renderServices(state.config);
        renderHomeServices(state.config);
        renderBooking(state.config);
        if (state.servicesEditor.renderList) {
          state.servicesEditor.renderList();
        }
      });
    }

    if (!resetButton.dataset.bound) {
      resetButton.dataset.bound = "true";
      resetButton.addEventListener("click", () => {
        clearServicesOverride();
        syncServicesEditorState(config);
        renderList();
        setStatus("Reset to the default services.");
        renderServices(state.config);
        renderHomeServices(state.config);
        renderBooking(state.config);
      });
    }
  }

  function renderServices(config) {
    const services = getServicesData(config);
    const grid = document.getElementById("servicesGrid");
    if (!grid) {
      return;
    }
    grid.innerHTML = "";
    services.forEach((service) => {
      const card = document.createElement("div");
      card.className = "card service-card";
      const description = service.description ? `<p class="hint">${service.description}</p>` : "";
      card.innerHTML = `
        <div>
          <h3>${service.name}</h3>
          <div class="service-meta">
            <span>${service.duration || ""}</span>
            <span class="service-price">${service.price || ""}</span>
          </div>
          ${description}
        </div>
        <a class="button-outline" href="#/book?service=${encodeURIComponent(service.id)}">Book</a>
      `;
      grid.appendChild(card);
    });
  }

  function renderAdmin(config) {
    const servicesConfig = getServicesEditorConfig(config);
    const collectionsConfig = config.collections && config.collections.editor
      ? config.collections.editor
      : {};
    const adminAccess = document.getElementById("adminAccess");
    const unlockButton = document.getElementById("adminUnlock");
    const servicesEditor = document.getElementById("servicesEditor");
    const collectionsEditor = document.getElementById("collectionsEditor");

    if (!adminAccess || !unlockButton) {
      return;
    }

    const hasServices = Boolean(servicesConfig.enabled);
    const hasCollections = Boolean(collectionsConfig.enabled);

    if (!hasServices && !hasCollections) {
      adminAccess.classList.add("hidden");
      if (servicesEditor) {
        servicesEditor.classList.add("hidden");
      }
      if (collectionsEditor) {
        collectionsEditor.classList.add("hidden");
      }
      return;
    }

    if (hasServices) {
      renderServicesEditor(config);
    }
    if (hasCollections) {
      renderCollectionsEditor(config);
    }

    function getAdminPin() {
      const latestServices = getServicesEditorConfig(config);
      const latestCollections = config.collections && config.collections.editor
        ? config.collections.editor
        : {};
      return (latestServices.pin || latestCollections.pin || "").trim();
    }

    function unlockAdmin() {
      const adminPin = getAdminPin();
      if (!adminPin) {
        return true;
      }
      const entered = window.prompt("Enter admin password");
      if (entered !== adminPin) {
        window.alert("Incorrect password.");
        return false;
      }
      sessionStorage.setItem(servicesEditAuthKey, "true");
      return true;
    }

    function updateView() {
      const adminPin = getAdminPin();
      const hasPin = adminPin.length > 0;
      const authed = !hasPin || sessionStorage.getItem(servicesEditAuthKey) === "true";
      if (authed) {
        adminAccess.classList.add("hidden");
        if (servicesEditor && hasServices) {
          servicesEditor.classList.remove("hidden");
          if (state.servicesEditor.show) {
            state.servicesEditor.show(true);
          }
        }
        if (collectionsEditor && hasCollections) {
          collectionsEditor.classList.remove("hidden");
          if (state.collectionsEditor.show) {
            state.collectionsEditor.show(true);
          }
        }
      } else {
        adminAccess.classList.remove("hidden");
        if (servicesEditor) {
          servicesEditor.classList.add("hidden");
        }
        if (collectionsEditor) {
          collectionsEditor.classList.add("hidden");
        }
      }
    }

    if (!unlockButton.dataset.bound) {
      unlockButton.dataset.bound = "true";
      unlockButton.addEventListener("click", () => {
        if (!unlockAdmin()) {
          updateView();
          return;
        }
        if (state.servicesEditor.show) {
          state.servicesEditor.show(true);
        }
        if (state.collectionsEditor.show) {
          state.collectionsEditor.show(true);
        }
        updateView();
      });
    }

    state.servicesEditor.updateView = updateView;
    state.collectionsEditor.updateView = updateView;
    updateView();
  }

  function renderPolicies(config) {
    const policies = config.policies || {};
    const stack = document.getElementById("policiesStack");
    if (!stack) {
      return;
    }
    const policyItems = [
      { title: "Deposit Policy", text: policies.deposit },
      { title: "Cancellation Policy", text: policies.cancellation },
      { title: "Late Policy", text: policies.late },
      { title: "No-Show Policy", text: policies.noShow }
    ];
    stack.innerHTML = "";
    policyItems.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card policy-card";
      card.innerHTML = `<h3>${item.title}</h3><p>${item.text || ""}</p>`;
      stack.appendChild(card);
    });
  }

  function renderCollections(config) {
    const collections = getCollectionsData(config);
    const embedSection = document.getElementById("collectionsEmbedSection");
    if (embedSection) {
      embedSection.classList.add("hidden");
    }

    const localSection = document.getElementById("collectionsLocalSection");
    if (localSection) {
      localSection.classList.remove("hidden");
    }

    const tabs = document.getElementById("collectionTabs");
    const grid = document.getElementById("collectionGrid");
    if (!tabs || !grid) {
      return;
    }

    const categories = collections.categories || [];
    tabs.innerHTML = "";
    grid.innerHTML = "";

    if (!categories.length) {
      grid.innerHTML = '<p class="hint">Add collection images in config.json.</p>';
      return;
    }

    categories.forEach((category, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tab-button";
      button.textContent = category.label;
      button.addEventListener("click", () => setActiveCategory(index));
      tabs.appendChild(button);
    });

    setActiveCategory(0);

    function setActiveCategory(index) {
      const active = categories[index];
      const buttons = tabs.querySelectorAll(".tab-button");
      buttons.forEach((button, idx) => {
        button.classList.toggle("active", idx === index);
      });
      grid.innerHTML = "";
      (active.images || []).forEach((image) => {
        const figure = document.createElement("figure");
        figure.className = "gallery-item";
        const caption = image.caption ? `<figcaption>${image.caption}</figcaption>` : "";
        figure.innerHTML = `<img src="${image.src}" alt="${image.alt || active.label}" loading="lazy" />${caption}`;
        grid.appendChild(figure);
      });
    }

  }

  function renderCollectionsEditor(config) {
    const editorConfig = (config.collections && config.collections.editor) || {};
    const editor = document.getElementById("collectionsEditor");
    const list = document.getElementById("collectionsEditorList");
    const addButton = document.getElementById("collectionsAddCategory");
    const saveButton = document.getElementById("collectionsSave");
    const resetButton = document.getElementById("collectionsReset");
    const status = document.getElementById("collectionsEditorStatus");

    if (!editor || !list || !addButton || !saveButton || !resetButton) {
      return;
    }

    if (!editorConfig.enabled) {
      editor.classList.add("hidden");
      return;
    }

    let currentPin = (editorConfig.pin || "").trim();

    function setStatus(message) {
      if (status) {
        status.textContent = message;
      }
    }

    function renderList() {
      list.innerHTML = "";
      const categories = state.collectionsEditor.categories || [];
      if (!categories.length) {
        const empty = document.createElement("p");
        empty.className = "hint";
        empty.textContent = "No collections yet. Add your first collection.";
        list.appendChild(empty);
        return;
      }

      categories.forEach((category, catIndex) => {
        const card = document.createElement("div");
        card.className = "card editor-category";
        card.innerHTML = `
          <div class="editor-header">
            <h3>Collection ${catIndex + 1}</h3>
            <button class="button-outline small remove-category" type="button">Remove</button>
          </div>
          <div class="input-group">
            <label>Collection name</label>
            <input type="text" class="category-label" value="${category.label || ""}" placeholder="e.g. Soft Pink" />
          </div>
          <div class="editor-grid">
            <div class="input-group">
              <label>Image URL</label>
              <input type="url" class="image-url" placeholder="https://..." />
            </div>
            <div class="input-group">
              <label>Upload image</label>
              <input type="file" class="image-file" accept="image/*" />
            </div>
            <div class="input-group">
              <label>Alt text (optional)</label>
              <input type="text" class="image-alt" placeholder="Short description" />
            </div>
            <div class="input-group">
              <label>Caption (optional)</label>
              <input type="text" class="image-caption" placeholder="Short caption" />
            </div>
          </div>
          <button class="button-outline small add-image" type="button">Add Image</button>
          <div class="stack image-list"></div>
        `;

        const labelInput = card.querySelector(".category-label");
        if (labelInput) {
          labelInput.addEventListener("input", () => {
            state.collectionsEditor.categories[catIndex].label = labelInput.value;
          });
        }

        const removeButton = card.querySelector(".remove-category");
        if (removeButton) {
          removeButton.addEventListener("click", () => {
            state.collectionsEditor.categories.splice(catIndex, 1);
            renderList();
          });
        }

        const imageList = card.querySelector(".image-list");
        if (imageList) {
          imageList.innerHTML = "";
          const images = category.images || [];
          if (!images.length) {
            const emptyImages = document.createElement("p");
            emptyImages.className = "hint";
            emptyImages.textContent = "No images yet.";
            imageList.appendChild(emptyImages);
          } else {
            images.forEach((image, imgIndex) => {
              const row = document.createElement("div");
              row.className = "image-row";
              const previewText = image.caption || image.alt || "Image";
              const sourceText = image.src && image.src.startsWith("data:") ? "Local upload" : image.src;
              row.innerHTML = `
                <img class="image-thumb" src="${image.src}" alt="${image.alt || ""}" />
                <div class="image-meta">
                  <div>${previewText}</div>
                  <div class="hint">${sourceText || ""}</div>
                </div>
              `;
              const removeImage = document.createElement("button");
              removeImage.className = "button-outline small";
              removeImage.type = "button";
              removeImage.textContent = "Remove";
              removeImage.addEventListener("click", () => {
                state.collectionsEditor.categories[catIndex].images.splice(imgIndex, 1);
                renderList();
              });
              row.appendChild(removeImage);
              imageList.appendChild(row);
            });
          }
        }

        const addImageButton = card.querySelector(".add-image");
        if (addImageButton) {
          addImageButton.addEventListener("click", () => {
            const urlInput = card.querySelector(".image-url");
            const fileInput = card.querySelector(".image-file");
            const altInput = card.querySelector(".image-alt");
            const captionInput = card.querySelector(".image-caption");
            const urlValue = urlInput ? urlInput.value.trim() : "";
            const altValue = altInput ? altInput.value.trim() : "";
            const captionValue = captionInput ? captionInput.value.trim() : "";
            const file = fileInput && fileInput.files ? fileInput.files[0] : null;

            const pushImage = (src) => {
              if (!src) {
                setStatus("Add an image URL or upload a file first.");
                return;
              }
              const image = {
                src,
                alt: altValue || category.label || "Nail set",
                caption: captionValue
              };
              if (!Array.isArray(state.collectionsEditor.categories[catIndex].images)) {
                state.collectionsEditor.categories[catIndex].images = [];
              }
              state.collectionsEditor.categories[catIndex].images.push(image);
              if (urlInput) {
                urlInput.value = "";
              }
              if (altInput) {
                altInput.value = "";
              }
              if (captionInput) {
                captionInput.value = "";
              }
              if (fileInput) {
                fileInput.value = "";
              }
              renderList();
            };

            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                pushImage(reader.result);
              };
              reader.onerror = () => {
                setStatus("Could not read the file. Try again.");
              };
              reader.readAsDataURL(file);
              return;
            }

            if (urlValue) {
              pushImage(urlValue);
              return;
            }

            setStatus("Add an image URL or upload a file first.");
          });
        }

        list.appendChild(card);
      });
    }

    function unlockEditor() {
      if (!currentPin) {
        return true;
      }
      if (sessionStorage.getItem(servicesEditAuthKey) === "true") {
        return true;
      }
      const authed = sessionStorage.getItem(collectionsEditAuthKey) === "true";
      if (authed) {
        return true;
      }
      const entered = window.prompt("Enter collections PIN");
      if (entered !== currentPin) {
        setStatus("Incorrect PIN.");
        return false;
      }
      sessionStorage.setItem(collectionsEditAuthKey, "true");
      return true;
    }

    function showEditor(forceOpen) {
      const isHidden = editor.classList.contains("hidden");
      if (!isHidden && !forceOpen) {
        editor.classList.add("hidden");
        return;
      }
      if (!unlockEditor()) {
        return;
      }
      syncCollectionsEditorState(config);
      renderList();
      editor.classList.remove("hidden");
    }

    state.collectionsEditor.show = showEditor;
    state.collectionsEditor.renderList = renderList;

    if (!addButton.dataset.bound) {
      addButton.dataset.bound = "true";
      addButton.addEventListener("click", () => {
        state.collectionsEditor.categories.push({
          id: `collection-${Date.now()}`,
          label: "New Collection",
          images: []
        });
        renderList();
      });
    }

    if (!saveButton.dataset.bound) {
      saveButton.dataset.bound = "true";
      saveButton.addEventListener("click", () => {
        saveCollectionsOverride(state.collectionsEditor.categories);
        setStatus("Saved locally. Copy updates into config.json to publish.");
        renderCollections(state.config);
        renderHomeGallery(state.config);
      });
    }

    if (!resetButton.dataset.bound) {
      resetButton.dataset.bound = "true";
      resetButton.addEventListener("click", () => {
        clearCollectionsOverride();
        syncCollectionsEditorState(config);
        renderList();
        setStatus("Reset to the default collections.");
        renderCollections(state.config);
        renderHomeGallery(state.config);
      });
    }
  }

  function renderBooking(config) {
    const booking = config.booking || {};
    const services = getServicesData(config);

    setText("bookDeposit", depositSummary(booking.deposit));

    fillServiceSelect(document.getElementById("customService"), services);

    const mode = (booking.mode || "embed").toLowerCase();
    const schedulerTitle = document.getElementById("schedulerTitle");
    const schedulerEmbed = document.getElementById("schedulerEmbed");
    const schedulerHint = document.getElementById("schedulerHint");
    const customForm = document.getElementById("customBookingForm");
    const customHint = document.getElementById("customBookingHint");

    const embedCode = booking.embed && booking.embed.embedCode ? booking.embed.embedCode.trim() : "";
    const embedUrl = booking.embed && booking.embed.embedUrl ? booking.embed.embedUrl.trim() : "";
    const isCustom = mode === "custom";

    if (schedulerTitle) {
      schedulerTitle.textContent = isCustom ? "Booking Request" : "Online Scheduler";
    }

    if (isCustom) {
      if (schedulerEmbed) {
        schedulerEmbed.classList.add("hidden");
      }
      if (schedulerHint) {
        schedulerHint.classList.add("hidden");
      }
      if (customForm) {
        customForm.classList.remove("hidden");
      }
      if (customHint) {
        customHint.textContent = booking.custom && booking.custom.instructions
          ? booking.custom.instructions
          : "Requests are reviewed within 24 hours.";
      }
    } else {
      if (customForm) {
        customForm.classList.add("hidden");
      }
      if (schedulerEmbed) {
        schedulerEmbed.classList.remove("hidden");
      }
      if (embedCode) {
        schedulerEmbed.innerHTML = "";
        injectEmbed(schedulerEmbed, embedCode);
        if (schedulerHint) {
          schedulerHint.classList.add("hidden");
        }
      } else if (embedUrl) {
        schedulerEmbed.innerHTML = `<iframe src="${embedUrl}" title="Booking scheduler"></iframe>`;
        if (schedulerHint) {
          schedulerHint.classList.add("hidden");
        }
      } else {
        schedulerEmbed.innerHTML = '<div class="empty-embed">Add your scheduler embed code to show booking here.</div>';
        if (schedulerHint) {
          schedulerHint.textContent = "Paste your Square, Calendly, or Acuity embed code into config.json under booking.embed.embedCode or set booking.embed.embedUrl.";
          schedulerHint.classList.remove("hidden");
        }
      }
    }

    if (customForm && !customForm.dataset.bound) {
      customForm.dataset.bound = "true";
      const defaultHint = customHint ? customHint.textContent : "";
      customForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (customHint) {
          customHint.textContent = "Request received. You will get a confirmation text.";
        }
        customForm.reset();
        if (customHint) {
          setTimeout(() => {
            customHint.textContent = defaultHint;
          }, 4000);
        }
      });
    }

  }

  function parseHash() {
    const hash = window.location.hash || "#/home";
    const cleaned = hash.replace(/^#\/?/, "");
    const [path, queryString] = cleaned.split("?");
    return {
      route: path || "home",
      query: new URLSearchParams(queryString || "")
    };
  }

  function applyServiceSelection(serviceId) {
    if (!serviceId) {
      return;
    }
    const select = document.getElementById("customService");
    if (!select) {
      return;
    }
    const match = Array.from(select.options).find((option) => option.value === serviceId);
    if (match) {
      select.value = serviceId;
    }
  }

  function triggerReveals(routeName) {
    const activePage = document.querySelector(`.page[data-route="${routeName}"]`);
    if (!activePage) {
      return;
    }
    const revealItems = Array.from(activePage.querySelectorAll(".reveal"));
    if (!revealItems.length) {
      return;
    }
    revealItems.forEach((el, index) => {
      el.classList.remove("is-visible");
      el.style.setProperty("--reveal-delay", `${index * 80}ms`);
    });
    requestAnimationFrame(() => {
      revealItems.forEach((el) => el.classList.add("is-visible"));
    });
  }

  function route() {
    const { route: rawRoute, query } = parseHash();
    const routeName = routes.has(rawRoute) ? rawRoute : "home";
    document.querySelectorAll(".page").forEach((page) => {
      const isActive = page.dataset.route === routeName;
      page.hidden = !isActive;
      page.setAttribute("aria-hidden", (!isActive).toString());
    });

    if (routeName === "book") {
      const serviceId = query.get("service");
      applyServiceSelection(serviceId);
    }
    if (routeName === "admin") {
      renderAdmin(state.config);
      if (state.servicesEditor.updateView) {
        state.servicesEditor.updateView();
      }
      if (state.collectionsEditor.updateView) {
        state.collectionsEditor.updateView();
      }
    }

    window.scrollTo(0, 0);
    triggerReveals(routeName);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    state.config = await loadConfig();
    renderHome(state.config);
    renderServices(state.config);
    renderAdmin(state.config);
    renderPolicies(state.config);
    renderCollections(state.config);
    renderBooking(state.config);
    route();
    window.addEventListener("hashchange", route);
  });
})();

(() => {
  const storageKey = "nchronicle.waitlist.v2";
  const form = document.querySelector("[data-signup-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const error = form.querySelector("[data-form-error]");
  const button = form.querySelector("button[type='submit']");
  const nameInput = form.querySelector("[data-signup-name]");
  const emailInput = form.querySelector("[data-signup-email]");
  const couponField = form.querySelector("[data-coupon-field]");
  const couponPreview = form.querySelector("[data-coupon-preview]");
  const couponPreviewCode = form.querySelector("[data-coupon-preview-code]");
  const confirmation = document.querySelector("[data-signup-confirmation]");
  const confirmationEmail = confirmation?.querySelector("[data-confirmation-email]");
  const couponOutput = confirmation?.querySelector("[data-coupon-output]");
  const copyButton = confirmation?.querySelector("[data-copy-code]");

  const makeCode = (email) => {
    let hash = 0;
    for (let index = 0; index < email.length; index += 1) {
      hash = ((hash * 31) + email.charCodeAt(index)) >>> 0;
    }
    return `NTER-30-${hash.toString(36).toUpperCase().padStart(6, "0").slice(-6)}`;
  };

  const updateCouponPreview = () => {
    const email = emailInput.value.trim().toLowerCase();
    if (emailInput.validity.valid && email) {
      const code = makeCode(email);
      couponField.value = code;
      couponPreviewCode.textContent = code;
      couponPreview.classList.add("is-ready");
      return;
    }
    couponField.value = "";
    couponPreviewCode.textContent = "NTER-30-••••••";
    couponPreview.classList.remove("is-ready");
  };

  emailInput.addEventListener("input", updateCouponPreview);
  updateCouponPreview();

  const readSaved = () => {
    try {
      const value = localStorage.getItem(storageKey);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const save = (record) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(record));
    } catch {
      // The confirmation still works when browser storage is unavailable.
    }
  };

  const showConfirmation = (record, focus = false) => {
    if (!confirmation || !confirmationEmail || !couponOutput) return;
    confirmationEmail.textContent = record.email;
    couponOutput.textContent = record.code;
    form.hidden = true;
    confirmation.hidden = false;
    if (focus) confirmation.focus();
  };

  const existing = readSaved();
  if (existing?.email && existing?.code) showConfirmation(existing);

  copyButton?.addEventListener("click", async () => {
    const code = couponOutput?.textContent;
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      copyButton.textContent = "Copied";
      window.setTimeout(() => { copyButton.textContent = "Copy code"; }, 1800);
    } catch {
      copyButton.textContent = code;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";

    if (!nameInput.value.trim()) {
      error.textContent = "Enter your name to join the list.";
      nameInput.focus();
      return;
    }

    if (!emailInput.validity.valid) {
      error.textContent = "Enter a valid email address so we can issue your code.";
      emailInput.focus();
      return;
    }

    const record = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      code: makeCode(emailInput.value.trim().toLowerCase()),
      edition: "001"
    };
    couponField.value = record.code;

    button.disabled = true;
    status.textContent = "Joining…";

    try {
      const body = new URLSearchParams(new FormData(form));
      await fetch(form.dataset.endpoint, {
        method: "POST",
        mode: "no-cors",
        body,
        keepalive: true
      });
      save(record);
      showConfirmation(record, true);
    } catch {
      status.textContent = "We couldn't submit that. Please try again.";
    } finally {
      button.disabled = false;
    }
  });
})();


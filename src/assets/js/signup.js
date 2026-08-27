(() => {
  const form = document.querySelector("[data-signup-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const button = form.querySelector("button[type='submit']");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    button.disabled = true;
    status.textContent = "Joining…";

    try {
      const body = new URLSearchParams(new FormData(form));
      await fetch(form.dataset.endpoint, {
        method: "POST",
        mode: "no-cors",
        body
      });
      form.reset();
      status.textContent = "You're on the list. Welcome to Chronicle.";
    } catch (error) {
      status.textContent = "We couldn't submit that. Please try again.";
    } finally {
      button.disabled = false;
    }
  });
})();

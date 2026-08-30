document.addEventListener("DOMContentLoaded", async () => {
  updateCopyrightYear();
  await loadDailyVerse();
  await loadEvents();

  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("show"));
  }
});

function updateCopyrightYear() {
  document.querySelectorAll("#year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
}

async function loadDailyVerse() {
  const referenceElement = document.getElementById("daily-verse-reference");
  const textElement = document.getElementById("daily-verse-text");

  if (!referenceElement || !textElement) return;

  try {
    const response = await fetch("assets/data/verses.json");

    if (!response.ok) {
      throw new Error("Could not load verse data.");
    }

    const verses = await response.json();
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((today - startOfYear) / 86400000);
    const verse = verses[dayOfYear % verses.length];

    referenceElement.textContent = verse.reference;
    textElement.textContent = `“${verse.text}”`;
  } catch (error) {
    console.error("Daily verse error:", error);
    referenceElement.textContent = "Matthew 18:20";
    textElement.textContent =
      "“For where two or three are gathered together in my name, there am I in the midst of them.”";
  }
}

async function loadEvents() {
  const eventsContainer = document.getElementById("events-list");

  if (!eventsContainer) return;

  try {
    const response = await fetch("assets/data/events.json");

    if (!response.ok) {
      throw new Error("Could not load events.");
    }

    const events = await response.json();
    eventsContainer.innerHTML = "";

    if (!Array.isArray(events) || events.length === 0) {
      eventsContainer.textContent = "No upcoming events are currently scheduled.";
      return;
    }

    events.forEach((event) => {
      const card = document.createElement("article");
      card.className = "event-card";

      const title = document.createElement("div");
      title.className = "event-title";
      title.textContent = event.title;

      const details = document.createElement("div");
      details.className = "event-meta";
      details.textContent = [event.date, event.time, event.location]
        .filter(Boolean)
        .join(" · ");

      const description = document.createElement("p");
      description.textContent = event.description;

      card.append(title, details, description);
      eventsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Events error:", error);
    eventsContainer.textContent =
      "Upcoming events could not be loaded. Please check back soon.";
  }
}

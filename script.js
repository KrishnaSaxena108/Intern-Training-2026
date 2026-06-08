const STORAGE_KEY = "ticket-management-tickets";

function loadTickets() {
  try {
    const storedTickets = localStorage.getItem(STORAGE_KEY);
    return storedTickets ? JSON.parse(storedTickets) : [];
  } catch {
    return [];
  }
}

function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

const tickets = loadTickets();
let selectedTicketId = tickets[0]?.id ?? null;
let editingTicketId = null;

const ticketTableBody = document.getElementById("ticketTableBody");
const ticketDetails = document.getElementById("ticketDetails");
const ticketCount = document.getElementById("ticketCount");
const ticketModal = document.getElementById("ticketModal");
const ticketForm = document.getElementById("ticketForm");
const newTicketButton = document.getElementById("newTicketButton");
const closeModalButton = document.getElementById("closeModalButton");
const cancelButton = document.getElementById("cancelButton");
const formModeLabel = document.getElementById("formModeLabel");
const formTitle = document.getElementById("formTitle");
const submitButton = document.getElementById("submitButton");

const fields = {
  ticketId: document.getElementById("ticketId"),
  subject: document.getElementById("subject"),
  status: document.getElementById("status"),
  priority: document.getElementById("priority"),
  assignee: document.getElementById("assignee"),
  description: document.getElementById("description"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeTicketId(value) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function getNextTicketId() {
  const highestNumber = tickets.reduce((max, ticket) => {
    const match = ticket.id.match(/(\d+)$/);
    const number = match ? Number(match[1]) : 0;
    return Math.max(max, number);
  }, 1000);

  return `TKT-${highestNumber + 1}`;
}

function statusClass(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function priorityClass(value) {
  return value.toLowerCase();
}

function openModal(mode, ticket = null) {
  editingTicketId = ticket?.id ?? null;
  formModeLabel.textContent = mode === "edit" ? "Edit Ticket" : "Create Ticket";
  formTitle.textContent = mode === "edit" ? `Edit ${ticket.id}` : "New Ticket";
  submitButton.textContent = mode === "edit" ? "Update Ticket" : "Save Ticket";

  fields.ticketId.value = ticket?.id ?? getNextTicketId();
  fields.subject.value = ticket?.subject ?? "";
  fields.status.value = ticket?.status ?? "Open";
  fields.priority.value = ticket?.priority ?? "Medium";
  fields.assignee.value = ticket?.assignee ?? "";
  fields.description.value = ticket?.description ?? "";

  clearErrors();
  ticketModal.classList.remove("hidden");
  ticketModal.setAttribute("aria-hidden", "false");
  fields.subject.focus();
}

function closeModal() {
  ticketModal.classList.add("hidden");
  ticketModal.setAttribute("aria-hidden", "true");
  ticketForm.reset();
  clearErrors();
  editingTicketId = null;
}

function clearErrors() {
  document.querySelectorAll(".error").forEach((errorElement) => {
    errorElement.textContent = "";
  });
}

function showFieldError(fieldName, message) {
  const errorElement = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function validateForm() {
  clearErrors();
  let valid = true;

  const subject = fields.subject.value.trim();
  const assignee = fields.assignee.value.trim();
  const description = fields.description.value.trim();

  if (subject.length < 3) {
    showFieldError("subject", "Subject must be at least 3 characters.");
    valid = false;
  }

  if (!fields.status.value) {
    showFieldError("status", "Select a status.");
    valid = false;
  }

  if (!fields.priority.value) {
    showFieldError("priority", "Select a priority.");
    valid = false;
  }

  if (assignee.length < 2) {
    showFieldError("assignee", "Assignee is required.");
    valid = false;
  }

  if (description.length < 10) {
    showFieldError("description", "Description must be at least 10 characters.");
    valid = false;
  }

  return valid;
}

function readFormData() {
  return {
    id: normalizeTicketId(fields.ticketId.value),
    subject: fields.subject.value.trim(),
    status: fields.status.value,
    priority: fields.priority.value,
    assignee: fields.assignee.value.trim(),
    description: fields.description.value.trim(),
  };
}

function renderTickets() {
  ticketCount.textContent = `${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`;
  ticketTableBody.innerHTML = tickets
    .map(
      (ticket) => `
        <tr>
          <td>${escapeHtml(ticket.id)}</td>
          <td>${escapeHtml(ticket.subject)}</td>
          <td><span class="status ${statusClass(ticket.status)}">${escapeHtml(ticket.status)}</span></td>
          <td><span class="priority ${priorityClass(ticket.priority)}">${escapeHtml(ticket.priority)}</span></td>
          <td>${escapeHtml(ticket.assignee)}</td>
          <td>
            <div class="ticket-actions">
              <button class="secondary-button" data-action="view" data-id="${escapeHtml(ticket.id)}">View</button>
              <button class="secondary-button" data-action="edit" data-id="${escapeHtml(ticket.id)}">Edit</button>
              <button class="secondary-button" data-action="delete" data-id="${escapeHtml(ticket.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");

  if (!tickets.length) {
    ticketTableBody.innerHTML = `
      <tr>
        <td colspan="6">No tickets yet. Create one to get started.</td>
      </tr>
    `;
  }

  renderDetails();
}

function renderDetails() {
  const ticket = tickets.find((item) => item.id === selectedTicketId) ?? tickets[0] ?? null;
  selectedTicketId = ticket?.id ?? null;

  if (!ticket) {
    ticketDetails.className = "details-empty";
    ticketDetails.innerHTML = "Select a ticket to view its details.";
    return;
  }

  ticketDetails.className = "details-grid";
  ticketDetails.innerHTML = `
    <div class="detail-item">
      <span>Ticket ID</span>
      <strong>${escapeHtml(ticket.id)}</strong>
    </div>
    <div class="detail-item">
      <span>Subject</span>
      <strong>${escapeHtml(ticket.subject)}</strong>
    </div>
    <div class="detail-item">
      <span>Status</span>
      <strong><span class="status ${statusClass(ticket.status)}">${escapeHtml(ticket.status)}</span></strong>
    </div>
    <div class="detail-item">
      <span>Priority</span>
      <strong><span class="priority ${priorityClass(ticket.priority)}">${escapeHtml(ticket.priority)}</span></strong>
    </div>
    <div class="detail-item">
      <span>Assignee</span>
      <strong>${escapeHtml(ticket.assignee)}</strong>
    </div>
    <div class="detail-item">
      <span>Created</span>
      <strong>${escapeHtml(ticket.createdAt)}</strong>
    </div>
    <div class="detail-item">
      <span>Description</span>
      <strong>${escapeHtml(ticket.description)}</strong>
    </div>
  `;
}

function deleteTicket(ticketId) {
  const confirmed = window.confirm(`Delete ${ticketId}?`);
  if (!confirmed) {
    return;
  }

  const index = tickets.findIndex((ticket) => ticket.id === ticketId);
  if (index !== -1) {
    tickets.splice(index, 1);
  }

  if (selectedTicketId === ticketId) {
    selectedTicketId = tickets[0]?.id ?? null;
  }

  saveTickets();
  renderTickets();
}

function upsertTicket(ticketData) {
  const targetIndex = tickets.findIndex((ticket) => ticket.id === ticketData.id);

  if (editingTicketId && targetIndex !== -1 && editingTicketId === ticketData.id) {
    tickets[targetIndex] = { ...tickets[targetIndex], ...ticketData };
  } else {
    tickets.unshift({
      ...ticketData,
      createdAt: new Date().toISOString().slice(0, 10),
    });
  }

  selectedTicketId = ticketData.id;
  saveTickets();
  renderTickets();
  closeModal();
}

function handleTableClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const { action, id } = button.dataset;
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) {
    return;
  }

  if (action === "view") {
    selectedTicketId = id;
    renderDetails();
    return;
  }

  if (action === "edit") {
    openModal("edit", ticket);
    return;
  }

  if (action === "delete") {
    deleteTicket(id);
  }
}

newTicketButton.addEventListener("click", () => openModal("create"));
closeModalButton.addEventListener("click", closeModal);
cancelButton.addEventListener("click", closeModal);

ticketModal.addEventListener("click", (event) => {
  if (event.target === ticketModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !ticketModal.classList.contains("hidden")) {
    closeModal();
  }
});

ticketTableBody.addEventListener("click", handleTableClick);

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const ticketData = readFormData();
  if (!editingTicketId && tickets.some((ticket) => ticket.id === ticketData.id)) {
    showFieldError("subject", "This ticket ID already exists. Try a new ticket.");
    return;
  }

  upsertTicket(ticketData);
});

renderTickets();

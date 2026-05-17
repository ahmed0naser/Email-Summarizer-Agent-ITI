const form = document.querySelector('#summarizeForm');
const emailInput = document.querySelector('#emailInput');
const emailFile = document.querySelector('#emailFile');
const fileName = document.querySelector('#fileName');
const messages = document.querySelector('#messages');
const errorBox = document.querySelector('#error');
const submitButton = document.querySelector('#submitButton');

emailFile.addEventListener('change', () => {
  fileName.textContent = emailFile.files[0]?.name || 'Upload email file';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const pastedEmail = emailInput.value.trim();
  const uploadedFile = emailFile.files[0];

  if (!pastedEmail && !uploadedFile) {
    showError('Please paste an email or upload a text email file.');
    return;
  }

  hideError();
  setLoading(true);
  clearEmptyState();
  addUserMessage(pastedEmail || 'Uploaded email file', uploadedFile?.name);

  const formData = new FormData();
  formData.append('email', pastedEmail);

  if (uploadedFile) {
    formData.append('emailFile', uploadedFile);
  }

  try {
    const response = await fetch('/api/summarize', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to summarize email.');
    }

    addAgentMessage(data.summary);
    form.reset();
    fileName.textContent = 'Upload email file';
  } catch (error) {
    showError(error.message || 'Failed to summarize email.');
  } finally {
    setLoading(false);
  }
});

function addUserMessage(text, uploadedFileName) {
  const article = document.createElement('article');
  article.className = 'message user-message';

  const title = uploadedFileName ? `<strong>${escapeHtml(uploadedFileName)}</strong>` : '';
  article.innerHTML = `
    <div class="message-label">Email input</div>
    ${title}
    <p>${escapeHtml(text)}</p>
  `;

  messages.appendChild(article);
  scrollToBottom();
}

function addAgentMessage(summary) {
  const article = document.createElement('article');
  article.className = 'message agent-message';

  const bullets = summary.bullets
    .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
    .join('');

  const actionItems = summary.actionItems?.length
    ? `
      <h3>Action items</h3>
      <ul>${summary.actionItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    `
    : '';

  article.innerHTML = `
    <div class="message-label">Agent summary</div>
    <h2>${escapeHtml(summary.subject)}</h2>
    <ul>${bullets}</ul>
    ${actionItems}
  `;

  messages.appendChild(article);
  scrollToBottom();
}

function clearEmptyState() {
  const empty = messages.querySelector('.empty');

  if (empty) {
    empty.remove();
  }
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
}

function hideError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? 'Summarizing...' : 'Summarize';
}

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

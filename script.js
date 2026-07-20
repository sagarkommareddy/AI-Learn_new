const bookingForm = document.querySelector('#booking-form');
const bookingMessage = document.querySelector('#booking-message');
const membershipDialog = document.querySelector('#membership-dialog');

const bookingService = bookingForm.querySelector('select');
const bookingDate = bookingForm.querySelector('input[type="date"]');
const urgentCare = document.querySelector('#urgent-care');
const availability = document.querySelector('#availability');
const availabilitySummary = document.querySelector('#availability-summary');
const timeSlots = document.querySelector('#time-slots');
const bookingButton = bookingForm.querySelector('button[type="submit"]');
const slotsByService = {
  'Haircut & style': ['9:00 AM', '10:30 AM', '1:00 PM', '3:30 PM', '5:00 PM'],
  'Colour refresh': ['9:00 AM', '12:00 PM', '2:30 PM', '4:30 PM'],
  'Skin ritual': ['10:00 AM', '11:30 AM', '2:00 PM', '4:00 PM', '5:30 PM'],
  Manicure: ['9:30 AM', '11:00 AM', '1:30 PM', '3:00 PM', '5:30 PM']
};

bookingDate.min = new Date().toISOString().split('T')[0];

function getPrettyDate() {
  return new Date(`${bookingDate.value}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
}

function showAvailability() {
  if (!bookingService.value || !bookingDate.value) {
    availability.hidden = true;
    bookingButton.disabled = false;
    return;
  }
  const slots = [...slotsByService[bookingService.value]];
  if (urgentCare.checked) slots.unshift('Next available - 9:00 AM');
  availability.hidden = false;
  bookingButton.disabled = true;
  availabilitySummary.textContent = `${bookingService.value} on ${getPrettyDate()}`;
  timeSlots.replaceChildren();
  slots.forEach((slot, index) => {
    const label = document.createElement('label');
    label.className = `time-slot${urgentCare.checked && index === 0 ? ' priority-slot' : ''}`;
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'appointment-time';
    input.value = slot;
    input.required = true;
    const text = document.createElement('span');
    text.textContent = slot;
    label.append(input, text);
    timeSlots.append(label);
  });
}

bookingService.addEventListener('change', showAvailability);
bookingDate.addEventListener('change', showAvailability);
urgentCare.addEventListener('change', showAvailability);
timeSlots.addEventListener('change', () => {
  bookingButton.disabled = !bookingForm.querySelector('input[name="appointment-time"]:checked');
});
bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const selectedSlot = bookingForm.querySelector('input[name="appointment-time"]:checked');
  if (!selectedSlot) {
    bookingMessage.textContent = 'Choose a service, date, and available time to reserve your appointment.';
    return;
  }
  const urgentNote = urgentCare.checked ? ' Your urgent-care request has been marked for priority.' : '';
  bookingMessage.textContent = `You’re booked for ${bookingService.value.toLowerCase()} on ${getPrettyDate()} at ${selectedSlot.value}.${urgentNote}`;
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const service = bookingForm.querySelector('select').value;
  const date = bookingForm.querySelector('input').value;
  const prettyDate = new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  bookingMessage.textContent = `Lovely — we’ll show ${service.toLowerCase()} times for ${prettyDate}.`;
});

document.querySelector('#join-button').addEventListener('click', () => membershipDialog.showModal());
document.querySelector('.close-dialog').addEventListener('click', () => membershipDialog.close());

document.querySelector('#member-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = event.currentTarget.querySelector('input[type="text"]').value.trim();
  event.currentTarget.reset();
  document.querySelector('.member-message').textContent = `Welcome to The Mirror, ${name}. Check your inbox for your next steps.`;
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('mobile-open');
});

const chatLauncher = document.querySelector('#chat-launcher');
const chatPanel = document.querySelector('#chat-panel');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');

function addChatMessage(text, type) {
  const message = document.createElement('div');
  message.className = `chat-bubble ${type}-bubble`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function stylishReply(message) {
  const note = message.toLowerCase();
  if (note.includes('book') || note.includes('appointment') || note.includes('visit')) return 'You can reserve your moment in the booking section. Choose a service and date, then we’ll help you find a lovely time.';
  if (note.includes('hair') || note.includes('cut') || note.includes('colour') || note.includes('color')) return 'Our hair menu includes cuts, signature styling, colour refreshes, and restoring treatments. Tell us your hair goal when you book!';
  if (note.includes('skin') || note.includes('facial')) return 'Our skin rituals are tailored to your complexion and your day. A facial is the perfect place to begin.';
  if (note.includes('nail') || note.includes('manicure')) return 'We offer modern manicure care and expressive nail art with a focus on healthy natural nails.';
  if (note.includes('member') || note.includes('membership')) return 'The Mirror Membership is $89 per month and includes priority booking, a monthly blowout, 10% off services, and a birthday ritual.';
  if (note.includes('hour') || note.includes('open') || note.includes('time')) return 'We are open Tuesday through Saturday, 9am to 7pm. We’d love to see you.';
  if (note.includes('hello') || note.includes('hi')) return 'Hi lovely! What can I help you feel fabulous about today?';
  return 'I can help with services, booking, memberships, and studio hours. What would you like to know?';
}

function openChat() { chatPanel.classList.add('is-open'); chatPanel.setAttribute('aria-hidden', 'false'); chatLauncher.setAttribute('aria-expanded', 'true'); chatInput.focus(); }
function closeChat() { chatPanel.classList.remove('is-open'); chatPanel.setAttribute('aria-hidden', 'true'); chatLauncher.setAttribute('aria-expanded', 'false'); }

chatLauncher.addEventListener('click', openChat);
document.querySelector('.chat-close').addEventListener('click', closeChat);
document.querySelector('#chat-form').addEventListener('submit', (event) => { event.preventDefault(); const message = chatInput.value.trim(); if (!message) return; addChatMessage(message, 'user'); chatInput.value = ''; window.setTimeout(() => addChatMessage(stylishReply(message), 'bot'), 300); });
document.querySelectorAll('[data-chat]').forEach((button) => button.addEventListener('click', () => { const message = button.dataset.chat; addChatMessage(message, 'user'); window.setTimeout(() => addChatMessage(stylishReply(message), 'bot'), 250); }));

const bookingForm = document.querySelector('#booking-form');
const bookingMessage = document.querySelector('#booking-message');
const membershipDialog = document.querySelector('#membership-dialog');

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
  document.querySelector('.member-message').textContent = `Welcome to Muse, ${name}. Check your inbox for your next steps.`;
});

document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('.nav').classList.toggle('mobile-open');
});

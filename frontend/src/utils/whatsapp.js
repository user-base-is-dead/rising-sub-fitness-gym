export const WHATSAPP_NUMBER = '916380816041';

export const getWhatsAppUrl = (msg) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const SUBJECTS = {
  membership: 'Membership Inquiry',
  training: 'Personal Training',
  feedback: 'Feedback',
  other: 'Other',
};

// Contact forms have no backend — submit opens WhatsApp with the details filled in
export const sendContactForm = (e) => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const field = (key) => (data.get(key) || '').toString().trim();

  const lines = [
    'Hello Rising Sun Fitness!',
    `Name: ${field('name')}`,
    `Phone: ${field('phone')}`,
  ];
  if (field('email')) lines.push(`Email: ${field('email')}`);
  if (field('subject')) lines.push(`Subject: ${SUBJECTS[field('subject')] || field('subject')}`);
  lines.push('', field('message'));

  window.open(getWhatsAppUrl(lines.join('\n')), '_blank', 'noopener');
};

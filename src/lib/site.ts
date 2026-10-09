// Everything the owner still has to supply lives here.
// An empty string renders as a visible [placeholder] on the site.
export const site = {
  name: 'Workflow Factory',
  founder: 'Ymar',
  email: '',
  bookingUrl: '',
  kvk: '',
  availability: '',
};

// Provisional choices for the example emails in the library. Still to be confirmed by the owner.
export const library = {
  // true: every example email is shown in full. false: only the goal of each email.
  // Switching to false also means rewriting FAQ src/content/faq/25.json, which assumes the emails are public.
  emailsPublic: true,
  // 'u' or 'je'. Emails are written with {u|je}, {uw|je}, {kunt u|kun je}; the build picks one.
  form: 'u' as 'u' | 'je',
  // Whose name the emails go out under. The emails are written in the first person.
  sender: 'de accountmanager',
};

export const CONTACT_PAGE_DATA = {
  banner: {
    title: "Contact Us",
    breadcrumb: ["Contact"],
  },

  info: {
    address: {
      label: "Address",
      value: "Kids' Foundation, Airport Road, Ghari, Imphal-West, Manipur – 795001, India",
      icon: "map-pin",
    },
    phone: {
      label: "Phone",
      value: "0385-2456231",
      icon: "phone",
    },
    mobile: {
      label: "Mobile",
      values: ["+91 8974426944", "+91 8787302983"],
      icon: "smartphone",
    },
    email: {
      label: "Email",
      value: "kidsfoundationghari@gmail.com",
      icon: "mail",
    },
    hours: {
      label: "Office Hours",
      value: "Monday – Friday: 9:00 AM – 3:00 PM",
      icon: "clock",
    },
  },

  form: {
    heading: "Send Us a Message",
    description: "Have questions about admissions, campus tours, or anything else? We'd love to hear from you.",
    fields: [
      { name: "name", label: "Your Name", type: "text", placeholder: "Enter your full name", required: true },
      { name: "email", label: "Email Address", type: "email", placeholder: "Enter your email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter your phone number", required: false },
      { name: "subject", label: "Subject", type: "text", placeholder: "What is this regarding?", required: true },
    ],
    messageField: { name: "message", label: "Message", placeholder: "Write your message here...", required: true },
    submitLabel: "Send Message",
  },

  map: {
    embedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7244.770281699026!2d93.9014291!3d24.7776411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3749261ea6480eaf%3A0xba24397b1a9bc2f6!2sKids%E2%80%99%20Foundation%20School%20%7C%20Manipur!5e0!3m2!1sen!2sin!4v1730000000000!5m2!1sen!2sin",
    directUrl:
      "https://www.google.com/maps/place/Kids%E2%80%99+Foundation+School+%7C+Manipur/@24.7764361,93.9105756,16z/data=!4m6!3m5!1s0x3749261ea6480eaf:0xba24397b1a9bc2f6!8m2!3d24.7764361!4d93.9105756!16s%2Fg%2F1hc2jgz_7",
    title: "Kids’ Foundation School | Manipur Location",
  },
};

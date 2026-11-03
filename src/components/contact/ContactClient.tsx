"use client";

import React, { useState } from "react";
import { PageBanner } from "@/components/ui/PageBanner";
import { MapPin, Phone, Smartphone, Mail, Clock, Loader2, AlertCircle } from "lucide-react";

const iconMap = {
  "map-pin": MapPin,
  phone: Phone,
  smartphone: Smartphone,
  mail: Mail,
  clock: Clock,
};

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

interface ContactClientProps {
  bannerTitle?: string;
  breadcrumb?: string[];
  bannerImage?: string;
  getInTouchLabel?: string;
  getInTouchHeading?: string;
  getInTouchDescription?: string;
  contactItems: ContactItem[];
  formHeading?: string;
  formDescription?: string;
  formSubmitLabel?: string;
  mapLabel?: string;
  mapHeading?: string;
  mapAddress?: string;
  mapEmbedUrl?: string;
  mapDirectUrl?: string;
  mapTitle?: string;
}

const DEFAULT_FORM_FIELDS = [
  { name: "name", label: "Your Name", type: "text", placeholder: "Enter your full name", required: true },
  { name: "email", label: "Email Address", type: "email", placeholder: "Enter your email", required: true },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "Enter your phone number", required: false },
  { name: "subject", label: "Subject", type: "text", placeholder: "What is this regarding?", required: true },
];

export function ContactClient({
  bannerTitle = "Contact Us",
  breadcrumb = ["Contact"],
  bannerImage = "/images/pages_hero_background_image/contact_hero.jpg",
  getInTouchLabel = "GET IN TOUCH",
  getInTouchHeading = "We'd love to hear from you",
  getInTouchDescription = "Whether you have questions about admissions, our curriculum, campus tours, or general queries, our friendly administrative team is here to assist you.",
  contactItems,
  formHeading = "Send Us a Message",
  formDescription = "Have questions about admissions, campus tours, or anything else? We'd love to hear from you.",
  formSubmitLabel = "Send Message",
  mapLabel = "FIND US",
  mapHeading = "Visit Our Campus",
  mapAddress = "Airport Road, NH 150, Ghari, Imphal, Manipur 795001",
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7244.770281699026!2d93.9014291!3d24.7776411!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3749261ea6480eaf%3A0xba24397b1a9bc2f6!2sKids%E2%80%99%20Foundation%20School%20%7C%20Manipur!5e0!3m2!1sen!2sin!4v1730000000000!5m2!1sen!2sin",
  mapDirectUrl = "https://www.google.com/maps/place/Kids%E2%80%99+Foundation+School+%7C+Manipur/@24.7764361,93.9105756,16z/data=!4m6!3m5!1s0x3749261ea6480eaf:0xba24397b1a9bc2f6!8m2!3d24.7764361!4d93.9105756!16s%2Fg%2F1hc2jgz_7",
  mapTitle = "Kids’ Foundation School | Manipur Location",
}: ContactClientProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    hp_website: "", // Honeypot anti-spam field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormState({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          hp_website: "",
        });
      } else {
        setErrorMessage(
          data.message ||
            "Unable to send your message. Please check your details and try again."
        );
      }
    } catch {
      setErrorMessage(
        "Network connection error. Please check your internet connection or call the school office directly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col bg-white overflow-x-hidden selection:bg-[#F47C61] selection:text-white">
      <main className="flex-1 flex flex-col">
        <PageBanner title={bannerTitle} breadcrumb={breadcrumb} image={bannerImage} />

        {/* Contact Info & Form */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
              {/* Contact Info */}
              <div className="lg:col-span-5">
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                  {getInTouchLabel}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.22] tracking-tight mb-4 sm:mb-6">
                  {getInTouchHeading}
                </h2>
                <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] mb-8">
                  {getInTouchDescription}
                </p>

                <div className="space-y-6">
                  {contactItems.map((item) => {
                    const Icon = iconMap[item.icon as keyof typeof iconMap] || MapPin;
                    return (
                      <div key={item.label} className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-[#E7EEF8] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-5 h-5 text-[#17345F]" />
                        </div>
                        <div>
                          <p className="text-xs sm:text-[13px] font-bold text-[#17345F] uppercase tracking-wider mb-1">
                            {item.label}
                          </p>
                          <p className="text-sm sm:text-base text-[#475569] leading-[1.7]">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-7">
                <div className="bg-[#FAF7F2] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-[#EBE3D5] shadow-[0_8px_30px_rgba(23,52,95,0.04)]">
                  <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2 inline-block leading-normal">
                    SEND A MESSAGE
                  </span>
                  <h3 className="text-xl sm:text-2xl lg:text-[28px] font-bold text-[#17345F] leading-[1.25] mb-2 tracking-tight">
                    {formHeading}
                  </h3>
                  <p className="text-sm sm:text-base text-[#475569] leading-[1.8] sm:leading-[1.85] mb-6 sm:mb-8">
                    {formDescription}
                  </p>

                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-[#17345F] mb-1">Thank you!</h4>
                      <p className="text-sm text-[#475569]">
                        Your message has been received. We&apos;ll get back to you soon.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setErrorMessage(null);
                          setFormState({
                            name: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                            hp_website: "",
                          });
                        }}
                        className="mt-4 text-sm text-[#F47C61] hover:text-[#E0684E] font-semibold transition-colors cursor-pointer"
                      >
                        Send another message →
                      </button>
                    </div>
                  ) : (
                    <div>
                      {errorMessage && (
                        <div
                          role="alert"
                          className="mb-5 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn"
                        >
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div className="flex-1 font-medium">{errorMessage}</div>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Honeypot field for anti-spam (hidden from genuine users) */}
                        <div
                          className="opacity-0 absolute -left-[9999px] h-0 w-0 z-[-1] pointer-events-none"
                          aria-hidden="true"
                        >
                          <label htmlFor="hp_website">Leave this field blank</label>
                          <input
                            type="text"
                            id="hp_website"
                            name="hp_website"
                            tabIndex={-1}
                            autoComplete="off"
                            value={formState.hp_website}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {DEFAULT_FORM_FIELDS.map((field) => (
                            <div key={field.name}>
                              <label
                                htmlFor={field.name}
                                className="block text-xs font-semibold text-[#17345F] mb-1.5"
                              >
                                {field.label}
                                {field.required && <span className="text-[#F47C61] ml-0.5">*</span>}
                              </label>
                              <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                placeholder={field.placeholder}
                                required={field.required}
                                disabled={isSubmitting}
                                value={formState[field.name as keyof typeof formState]}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#17345F] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F47C61]/30 focus:border-[#F47C61] disabled:bg-slate-50 disabled:text-slate-500 transition-all"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label
                            htmlFor="message"
                            className="block text-xs font-semibold text-[#17345F] mb-1.5"
                          >
                            Message
                            <span className="text-[#F47C61] ml-0.5">*</span>
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            placeholder="Write your message here..."
                            required
                            disabled={isSubmitting}
                            value={formState.message}
                            onChange={handleChange}
                            rows={5}
                            className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-[#17345F] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F47C61]/30 focus:border-[#F47C61] disabled:bg-slate-50 disabled:text-slate-500 transition-all resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex items-center justify-center bg-[#F47C61] hover:bg-[#E0684E] disabled:bg-[#F47C61]/70 disabled:cursor-not-allowed text-white text-sm font-semibold px-7 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-200 active:scale-98 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              <span>Sending Message...</span>
                            </>
                          ) : (
                            formSubmitLabel
                          )}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF7F2]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[100px]">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 mb-8 sm:mb-10 text-center sm:text-left">
              <div>
                <span className="text-[#D97706] font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase mb-2.5 sm:mb-3 inline-block leading-normal">
                  {mapLabel}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#17345F] leading-[1.22] tracking-tight">
                  {mapHeading}
                </h2>
                <p className="text-sm text-[#64748B] mt-1.5">
                  {mapAddress}
                </p>
              </div>

              <a
                href={mapDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#17345F] text-[#17345F] hover:text-white px-5 py-2.5 rounded-full border border-slate-300 text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 group shrink-0"
              >
                <MapPin className="w-4 h-4 text-[#F47C61] group-hover:text-white transition-colors" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            <div className="w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[16/7] rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(23,52,95,0.08)] border border-slate-200 bg-[#E7EEF8]">
              <iframe
                src={mapEmbedUrl}
                title={mapTitle}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

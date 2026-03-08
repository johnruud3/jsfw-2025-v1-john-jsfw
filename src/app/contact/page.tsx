"use client";

import { useState, useCallback } from "react";

type FormErrors = {
  fullName?: string;
  subject?: string;
  email?: string;
  message?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFullName(value: string): string | undefined {
  if (!value.trim()) return "Full name is required.";
  if (value.trim().length < 3)
    return "Full name must be at least 3 characters.";
  return undefined;
}

function validateSubject(value: string): string | undefined {
  if (!value.trim()) return "Subject is required.";
  if (value.trim().length < 3) return "Subject must be at least 3 characters.";
  return undefined;
}

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(value.trim()))
    return "Please enter a valid email address.";
  return undefined;
}

function validateMessage(value: string): string | undefined {
  if (!value.trim()) return "Message is required.";
  if (value.trim().length < 10)
    return "Message must be at least 10 characters.";
  return undefined;
}

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {
      fullName: validateFullName(fullName),
      subject: validateSubject(subject),
      email: validateEmail(email),
      message: validateMessage(message),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }, [fullName, subject, email, message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    // Here you could send the form (e.g. API route, email service)
    alert("Thank you! Your message has been sent.");
    setFullName("");
    setSubject("");
    setEmail("");
    setMessage("");
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className="container mx-auto px-4 py-25 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Contact us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">
            Subject *
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && (
            <p
              id="subject-error"
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-md p-2 resize-y"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p
              id="message-error"
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600"
        >
          Send message
        </button>
      </form>
    </div>
  );
}

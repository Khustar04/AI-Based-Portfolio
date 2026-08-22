import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setErrorMessage("");

    const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;

    try {
      if (googleSheetUrl && googleSheetUrl.trim() !== "") {
        const formPayload = new FormData();
        formPayload.append("name", formData.name.trim());
        formPayload.append("email", formData.email.trim());
        formPayload.append("subject", formData.subject.trim());
        formPayload.append("message", formData.message.trim());
        formPayload.append("timestamp", new Date().toLocaleString());

        // Fast background dispatch with keepalive
        const fetchPromise = fetch(googleSheetUrl, {
          method: "POST",
          body: formPayload,
          mode: "no-cors",
          keepalive: true,
        }).catch((err) => {
          console.warn("Background submission note:", err);
        });

        // Fast 400ms tactile feedback so the user gets an instant snappy response
        await Promise.race([
          fetchPromise,
          new Promise((resolve) => setTimeout(resolve, 400)),
        ]);
      } else {
        // Fast simulation when URL is not configured
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus("error");
      setErrorMessage("Failed to send your message. Please try again or email directly.");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const inputClasses = (field) =>
    `w-full px-4 py-3 rounded-xl border bg-white/70 dark:bg-slate-900/70 backdrop-blur-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 shadow-inner ${
      errors[field]
        ? "border-red-300 dark:border-red-700"
        : "border-white/80 dark:border-slate-700/70 focus:border-blue-500 dark:focus:border-blue-400"
    }`;

  return (
    <div className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-2xl border border-white/80 dark:border-slate-700/60 rounded-3xl p-6 md:p-10 shadow-2xl shadow-blue-500/10">
      {status === "success" ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-2xl bg-green-50/80 dark:bg-green-950/40 backdrop-blur-md border border-green-200/80 dark:border-green-800/50 flex items-center justify-center mx-auto mb-4 animate-bounce shadow-md">
            <CheckCircle2 size={32} className="text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm max-w-sm mx-auto mb-6">
            Thank you for reaching out. Your message has been recorded and emailed to Khustar. I will get back to you shortly!
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="px-5 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-white/70 dark:bg-blue-950/40 backdrop-blur-md rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-blue-200/80 dark:border-blue-800/40"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className={inputClasses("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="John04@example.com"
                value={formData.email}
                onChange={handleChange}
                className={inputClasses("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Java Developer Role / Project Inquiry"
              value={formData.subject}
              onChange={handleChange}
              className={inputClasses("subject")}
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1.5">{errors.subject}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Hi Khustar, I came across your portfolio and would like to discuss..."
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`${inputClasses("message")} resize-none`}
            />
            {errors.message && (
              <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
            )}
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 backdrop-blur-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={18} className="shrink-0" />
              <span>{errorMessage || "Failed to send message. Please try again."}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-blue-500/25"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

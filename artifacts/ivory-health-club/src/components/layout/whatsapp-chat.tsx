import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "2348108897628";

const QUICK_MESSAGES = [
  {
    label: "Membership enquiry",
    message: "Hello Ivory Health Club, I would like to enquire about membership plans.",
  },
  {
    label: "Book a service",
    message: "Hello Ivory Health Club, I would like to book a service. Please share the available options.",
  },
  {
    label: "Ask a question",
    message: "Hello Ivory Health Club, I have a question. Please can you assist me?",
  },
];

function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: PointerEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={widgetRef} className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {open && (
        <div
          id="whatsapp-chat-panel"
          className="mb-3 w-[min(20rem,calc(100vw-2.5rem))] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        >
          <div className="bg-[#075e54] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-bold">Chat with Ivory</p>
                <p className="mt-1 text-xs text-white/80">Quick enquiries on WhatsApp</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close WhatsApp chat options"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="space-y-2 p-3">
            {QUICK_MESSAGES.map((option) => (
              <a
                key={option.label}
                href={getWhatsAppUrl(option.message)}
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="block rounded-xl border border-gray-100 px-4 py-3 text-sm font-semibold text-secondary transition-colors hover:border-[#25d366] hover:bg-[#f2fcf6]"
              >
                {option.label}
              </a>
            ))}
            <p className="px-1 pt-1 text-center text-[11px] text-gray-400">
              We’ll continue the conversation in WhatsApp.
            </p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#075e54]/25 transition-transform hover:-translate-y-0.5 hover:bg-[#20bd5b] focus:outline-none focus:ring-2 focus:ring-[#25d366] focus:ring-offset-2"
        aria-expanded={open}
        aria-controls="whatsapp-chat-panel"
        aria-label={open ? "Close WhatsApp chat options" : "Open WhatsApp chat options"}
      >
        <FaWhatsapp size={22} aria-hidden="true" />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </button>
    </div>
  );
}
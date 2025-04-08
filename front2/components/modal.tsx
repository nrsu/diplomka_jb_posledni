import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add("overflow-hidden"); // Блокировка прокрутки при открытой модалке
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900 animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Остановка всплытия, чтобы клик внутри не закрывал модалку
      >
        {/* Кнопка закрытия */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Заголовок модального окна */}
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}

        {/* Контент */}
        <div>{children}</div>

        {/* Кнопки */}
        {/* <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => alert("Confirmed!")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md hover:bg-blue-700"
          >
            Confirm
          </button>
        </div> */}
      </div>

      {/* Анимации */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

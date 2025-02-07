import React from "react";

function LoadingModul({ size, theme }) {
    return (
        <>
        <svg
            style={{ height: size, width: size }}
            aria-hidden="true"
            className={`${
                theme === "light"
                ? "text-gray-200 dark:text-gray-600"
                : "dark:text-gray-600 text-white"
            } animate-spin fill-black`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
        <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9765 22.3858 0.59082 50 0.59082"
        fill="currentColor"
        />
        <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.007 33.4852C95.0512 27.7086 91.5139 22.626 86.8726 18.7336C82.2312 14.8412 76.6676 12.2558 70.7895 11.2217C64.9114 10.1876 58.9556 10.7355 53.3636 12.8197C47.7715 14.9039 42.7462 18.4615 38.7605 23.1831"
        fill="currentFill"
        />
        </svg>
      </>
    );
};

export default LoadingModul;
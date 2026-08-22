import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return true;
        }
        return false;
      };

      if (scrollToHash()) return;

      const retryA = setTimeout(scrollToHash, 120);
      const retryB = setTimeout(scrollToHash, 400);
      return () => {
        clearTimeout(retryA);
        clearTimeout(retryB);
      };
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

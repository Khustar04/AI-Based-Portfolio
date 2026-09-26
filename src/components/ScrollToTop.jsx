import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const scrollToHash = () => {
        const el = document.getElementById(id);
        if (el) {
          if (lenis) {
            lenis.scrollTo(el, { offset: -80 });
          } else {
            el.scrollIntoView();
          }
          return true;
        }
        return false;
      };

      if (scrollToHash()) return;

      const retryA = setTimeout(scrollToHash, 100);
      const retryB = setTimeout(scrollToHash, 300);
      return () => {
        clearTimeout(retryA);
        clearTimeout(retryB);
      };
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, lenis]);

  return null;
}

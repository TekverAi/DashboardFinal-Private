import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component ensures that the page scroll position 
 * is reset to the top whenever the route changes.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll window to top on route change
    window.scrollTo(0, 0);
    
    // Also handle cases where a specific element might be scrolling
    // (though in this layout it seems to be the window/body)
    const dashboardContent = document.querySelector('main');
    if (dashboardContent) {
      dashboardContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
}

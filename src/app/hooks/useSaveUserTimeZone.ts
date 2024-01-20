import { useEffect } from "react";
import axios from "axios";

/**
 * Persist user's time zone to the server if it has changed or has not been persisted in the last 24 hours
 */
export default function useSaveUserTimeZone() {
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const makeRequest = async () => {
      await axios.post("/api/user-info", {
        timeZone,
      });

      localStorage.setItem(
        "post_user_info_public_last_request_time",
        Date.now().toString(),
      );
      localStorage.setItem("post_user_info_public_time_zone", timeZone);
    };

    const shouldMakeRequest = () => {
      const lastRequestTime = localStorage.getItem(
        "post_user_info_public_last_request_time",
      );
      if (!lastRequestTime) {
        return true;
      }

      const lastTimeZone = localStorage.getItem(
        "post_user_info_public_time_zone",
      );
      if (!lastRequestTime) {
        return true;
      }

      if (lastTimeZone !== timeZone) {
        return true;
      }

      const timeElapsed = Date.now() - Number.parseInt(lastRequestTime);
      return timeElapsed > 24 * 60 * 60 * 1000;
    };

    if (shouldMakeRequest()) {
      void makeRequest();
    }
  }, []);
}

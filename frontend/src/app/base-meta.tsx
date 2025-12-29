"use client";

import { useEffect } from "react";

export function BaseMeta() {
  useEffect(() => {
    // Check if meta tag already exists
    let metaTag = document.querySelector('meta[name="base:app_id"]');
    
    if (!metaTag) {
      // Create and add the meta tag
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "base:app_id");
      metaTag.setAttribute("content", "6952a1d74d3a403912ed851e");
      document.head.appendChild(metaTag);
    } else {
      // Update existing meta tag
      metaTag.setAttribute("content", "6952a1d74d3a403912ed851e");
    }
  }, []);

  return null;
}


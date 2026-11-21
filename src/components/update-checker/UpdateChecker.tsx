import React from "react";
import { useTranslation } from "react-i18next";
import { openUrl } from "@tauri-apps/plugin-opener";

interface UpdateCheckerProps {
  className?: string;
}

// This preview has no updater check, event listener, download, or install path.
const UpdateChecker: React.FC<UpdateCheckerProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className={`text-xs text-ink-2 hover:text-text ${className}`}
      title={t("robeyVoice.updatesLink")}
      onClick={() =>
        openUrl("https://github.com/GrillerGeek/RobeyVoiceWindows/releases")
      }
    >
      {t("robeyVoice.manualUpdates")}
    </button>
  );
};

export default UpdateChecker;

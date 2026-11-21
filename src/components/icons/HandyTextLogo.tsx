import { useTranslation } from "react-i18next";

// Retain the component import contract; render this fork's translated identity.
const HandyTextLogo = ({
  width,
  height,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
}) => {
  const { t } = useTranslation();
  return (
    <span
      className={`font-semibold tracking-tight text-text ${className ?? ""}`}
      style={{ width, height }}
    >
      {t("robeyVoice.name")}
    </span>
  );
};
export default HandyTextLogo;

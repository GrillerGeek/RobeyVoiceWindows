import brand from "../../assets/robey-voice.svg";

const HandyHand = ({
  width = 126,
  height = 135,
  className,
}: {
  width?: number | string;
  height?: number | string;
  className?: string;
}) => (
  <img src={brand} width={width} height={height} className={className} alt="" />
);
export default HandyHand;

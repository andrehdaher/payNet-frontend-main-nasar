export default function ScreenWrapper({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

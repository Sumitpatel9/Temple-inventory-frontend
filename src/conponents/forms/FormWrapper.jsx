export default function FormWrapper({
  children,
  onSubmit,
  className = "",
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`space-y-6 ${className}`}
    >
      {children}
    </form>
  );
}

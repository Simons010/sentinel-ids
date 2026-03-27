import { useLocation } from "react-router";

export default function MobileNavigation() {
  const Location = useLocation();
  return (
    <div className="md:hidden lg:hidden">
      <h1 className="text-2xl font-bold text-white p-6 w-full">
        Mobile Navigation
      </h1>
    </div>
  );
}

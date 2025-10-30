import SpinnerLoader from "@components/SpinnerLoader";

export default function loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SpinnerLoader />
    </div>
  );
}

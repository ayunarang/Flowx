import { ClipLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={60} color="#3B82F6" /> 
    </div>
  );
}

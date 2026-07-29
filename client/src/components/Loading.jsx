import { ScaleLoader } from "react-spinners";

function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <ScaleLoader size={50} />
    </div>
  );
}

export default Loading;

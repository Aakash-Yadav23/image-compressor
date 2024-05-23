import Compressor from "@/components/compressor";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center dark justify-center p-6">
      <div className="py-5 pb-10 font-bold">
        <h1 className="text-2xl">
          Image Compressor
        </h1>
      </div>
      <Compressor />
    </main>
  );
}

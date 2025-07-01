import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { DownloadIcon } from "lucide-react"; 

export default function DownloadButton({ flowRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const downloadPNG = async () => {
    if (!flowRef.current) return;
    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "none";
    });
    const dataUrl = await toPng(flowRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "pipeline.png";
    link.click();
    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "";
    });
    setIsOpen(false);
  };

  const downloadPDF = async () => {
    if (!flowRef.current) return;
    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "none";
    });
    const dataUrl = await toPng(flowRef.current, { pixelRatio: 2 });
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [flowRef.current.offsetWidth, flowRef.current.offsetHeight],
    });
    pdf.addImage(
      dataUrl,
      "PNG",
      0,
      0,
      flowRef.current.offsetWidth,
      flowRef.current.offsetHeight
    );
    pdf.save("pipeline.pdf");
    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "";
    });
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1
          bg-blue-600 text-white rounded
           text-[10px] sm:text-sm
          font-medium
          px-2 py-1 sm:px-2 sm:py-1
        "
      >
        <span className="block md:hidden text-lg">
          <DownloadIcon height={14} width={14}/>
        </span>
        <span className="hidden md:block">Download</span>
      </button>

      {isOpen && (
<div
  className="
    absolute left-1/2 -translate-x-1/2 mt-4 w-32 
    bg-white border border-gray-200 rounded-md shadow-lg
    flex flex-col z-50
  "
>

          <button
            onClick={downloadPNG}
            className="
              text-left px-4 py-2 hover:bg-gray-100 text-xs sm:text-sm
            "
          >
            Download PNG
          </button>
          <button
            onClick={downloadPDF}
            className="
              text-left px-4 py-2 hover:bg-gray-100 text-xs sm:text-sm
            "
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

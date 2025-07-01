import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { DownloadIcon } from "lucide-react";
import DownloadDrawer from "./DownloadDrawer";

export default function DownloadButton({ flowRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [format, setFormat] = useState("png");
  const dropdownRef = useRef();

  const download = async () => {
    if (!flowRef.current) return;
    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "none";
    });

const dataUrl = await toPng(flowRef.current, {
  pixelRatio: 2,
  backgroundColor: "#ffffff" // ✅ Makes the background visible!
});

    if (format === "png") {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "pipeline.png";
      link.click();
    } else {
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
    }

    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "";
    });

    setIsOpen(false);
    setIsDrawerOpen(false);
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

  const isSmallScreen = window.innerWidth < 768;

  const handleClick = () => {
    if (isSmallScreen) {
      setIsDrawerOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleClick}
          className="
            flex items-center gap-1
            bg-blue-600 text-white rounded
            text-[10px] sm:text-sm
            font-medium
            px-2 py-1 sm:px-2 sm:py-1
          "
        >
          <span className="text-lg">
            <DownloadIcon height={14} width={14} />
          </span>
          <span className="hidden md:block">Download</span>
        </button>

        {/* Modal for >= md */}
        {isOpen && !isSmallScreen && (
          <div
            className="
              absolute left-1/2 -translate-x-1/2 mt-4 w-32
              bg-white border border-gray-200 rounded-md shadow-lg
              flex flex-col z-50
            "
          >
            <button
              onClick={() => {
                setFormat("png");
                download();
              }}
              className="text-left px-4 py-2 hover:bg-gray-100 text-xs sm:text-sm"
            >
              Download PNG
            </button>
            <button
              onClick={() => {
                setFormat("pdf");
                download();
              }}
              className="text-left px-4 py-2 hover:bg-gray-100 text-xs sm:text-sm"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Drawer for < md */}
      <DownloadDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        format={format}
        setFormat={setFormat}
        onDownload={download}
      />
    </>
  );
}

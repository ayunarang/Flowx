import { useState, useRef, useEffect } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { DownloadIcon } from "lucide-react";
import DownloadDrawer from "./DownloadDrawer";
import { useStore } from "../store";
import { toast } from "sonner";

export default function DownloadButton({ flowRef, isDrawer, styles }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [format, setFormat] = useState("png");
  const nodes = useStore((state) => state.nodes);

  const dropdownRef = useRef();
  const isSmallScreen = window.innerWidth < 768;


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const download = async () => {
    if (!flowRef.current) return;

    flowRef.current.querySelectorAll(".no-export").forEach((el) => {
      el.style.display = "none";
    });

    const isSmallScreen = window.innerWidth < 768;

    const devicePixelRatio = window.devicePixelRatio || 1;
    const pixelRatio = Math.max(devicePixelRatio, isSmallScreen ? 2 : 2);

    const dataUrl = await toPng(flowRef.current, {
      pixelRatio,
      backgroundColor: "#ffffff",
      filter: (node) => {
        if (node instanceof HTMLElement) {
          node.style.boxShadow = "none";
        }
        return true;
      },
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


  const handleClick = () => {
    if (nodes.length === 0) return toast.error("Pipeline is empty.")

    if (isSmallScreen) {
      setIsDrawerOpen(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <>
      <div className="relative w-full" ref={dropdownRef}>
        <button
          onClick={handleClick}
          className={`${(isDrawer) ? styles : "flex items-center gap-1 text-canvas-ink rounded text-[10px] sm:text-xs font-medium px-2 py-1 sm:px-2 sm:py-1"} `}>
          <DownloadIcon className="h-6 sm:h-5 w-6 sm:w-5" />
          <span className={!isDrawer && "hidden md:block"}>Download</span>
        </button>

        {isOpen && !isSmallScreen && (
          <div
            className="
              absolute left-1/2 -translate-x-1/2 mt-4 w-36
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

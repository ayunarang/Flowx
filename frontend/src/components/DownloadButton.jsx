
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function DownloadButton({ flowRef }) {
    const downloadPNG = async () => {
        if (!flowRef.current) return;

        flowRef.current.querySelectorAll('.no-export').forEach(el => {
            el.style.display = 'none';
        });

        const dataUrl = await toPng(flowRef.current, {
            pixelRatio: 2,
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "pipeline.png";
        link.click();

        flowRef.current.querySelectorAll('.no-export').forEach(el => {
            el.style.display = '';
        });
    };

    const downloadPDF = async () => {
        if (!flowRef.current) return;

        flowRef.current.querySelectorAll('.no-export').forEach(el => {
            el.style.display = 'none';
        });

        const dataUrl = await toPng(flowRef.current, {
            pixelRatio: 2,
        });

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

        flowRef.current.querySelectorAll('.no-export').forEach(el => {
            el.style.display = '';
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={downloadPNG}
                className="px-3 py-2 bg-blue-600 text-white rounded"
            >
                Download PNG
            </button>
            <button
                onClick={downloadPDF}
                className="px-3 py-2 bg-green-600 text-white rounded"
            >
                Download PDF
            </button>
        </div>
    );
}

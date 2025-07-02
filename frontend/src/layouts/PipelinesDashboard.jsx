import { useEffect, useState } from "react";
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";

export default function PipelinesDashboard() {
  const [pipelines, setPipelines] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 9;

  const [selectMode, setSelectMode] = useState(false);
  const [selectedPipelineId, setSelectedPipelineId] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      supabase
        .from("pipelines")
        .select("id, name, created_at")
        .eq("owner_id", user.id)
        .then(({ data, error }) => {
          if (error) {
            toast.error("Failed to fetch pipelines");
          } else {
            setPipelines(data);
          }
        });
    }
  }, [user]);

  const handleDelete = async (id) => {
    const { error } = await supabase.from("pipelines").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete pipeline");
    } else {
      setPipelines(pipelines.filter((p) => p.id !== id));
      toast.success("Pipeline deleted");
      setSelectedPipelineId(null);
      setSelectMode(false);
    }
  };

  const toggleSelectMode = () => {
    if (selectMode) {
      setSelectedPipelineId(null);
    }
    setSelectMode(!selectMode);
  };

  const handlePipelineSelect = (id) => {
    setSelectedPipelineId((prev) => (prev === id ? null : id));
  };

  const filteredPipelines = (search.trim() === ""
    ? pipelines
    : pipelines.filter((pipeline) =>
        pipeline.name.toLowerCase().includes(search.toLowerCase())
      )
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const pageCount = Math.ceil(filteredPipelines.length / pageSize);
  const paginatedPipelines = filteredPipelines.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-5 sm:p-8 mt-4 max-w-5xl mx-auto">
      {user?.email && (
        <h3 className="text-3xl text-canvas-ink font-normal mb-5">
          Hi, {user.email.split("@")[0]}
        </h3>
      )}

      <div className="flex flex-row justify-between sm:items-center mb-5 gap-4">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 active:scale-95 transition-all w-fit sm:w-auto flex gap-2 items-center font-medium text-sm"
          onClick={() => navigate("/")}
        >
          <span className="sm:hidden inline">New</span>
          <span className="hidden sm:inline">New Pipeline</span>
          <PlusIcon height={20} width={20} className="font-bold" />
        </button>

        <input
          type="text"
          placeholder="Search pipelines..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-fit sm:w-64 text-sm"
        />
      </div>

      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center mb-3 gap-4">
        <h3 className="text-xl text-canvas-ink font-bold w-fit whitespace-nowrap">
          Your Pipelines
        </h3>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-between w-full">
          <button
            onClick={toggleSelectMode}
            disabled={selectedPipelineId}
            className={`px-3 py-1 rounded text-sm font-medium border transition-all ${
              selectedPipelineId
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-transparent hover:bg-gray-50 active:bg-gray-100 border-gray-300"
            }`}
          >
            {selectMode ? "Cancel" : "Select"}
          </button>

          <div
            className={`flex gap-3 items-center transition-all duration-75 ${
              selectedPipelineId ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <button
              onClick={() => navigate(`/pipeline/${selectedPipelineId}`)}
              disabled={!selectedPipelineId}
              className="text-blue-600 active:bg-blue-50 rounded-lg items-center p-2 disabled:text-gray-400 transition-all"
            >
              <Pencil className="mr-1 h-6 w-6 font-medium" />
            </button>
            <button
              onClick={() => handleDelete(selectedPipelineId)}
              disabled={!selectedPipelineId}
              className="text-red-600 active:bg-red-50 rounded-lg items-center p-2 disabled:text-gray-400 transition-all"
            >
              <Trash2 className="mr-1 h-6 w-6 font-medium" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-100"
      >
        {paginatedPipelines.map((pipeline) => {
          const isSelected = pipeline.id === selectedPipelineId;

          return (
            <div
              key={pipeline.id}
              onClick={() => {
                if (selectMode) handlePipelineSelect(pipeline.id);
              }}
              className={`flex items-start gap-3 p-4 border rounded-md bg-canvas-beige transition-all duration-75 ease-in-out hover:shadow-md hover:-translate-y-0.5 ${
                selectMode ? "cursor-pointer" : ""
              } ${isSelected ? "border-purple-600 bg-purple-50" : "border-gray-200"}`}
            >
              {selectMode && (
                <span
                  className={`flex-none w-[14px] h-[14px] rounded-full border-2 mt-1 ${
                    isSelected
                      ? "border-purple-600 bg-purple-600"
                      : "border-gray-400"
                  } transition-all duration-75`}
                ></span>
              )}
              <div className="flex-1">
                <div className="text-base font-semibold text-black">
                  {pipeline.name}
                </div>
                <div className="text-sm text-gray-800 mt-1 flex gap-2 justify-between">
                  <span>{new Date(pipeline.created_at).toLocaleDateString()}</span>
                  <span>
                    {new Date(pipeline.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {paginatedPipelines.length === 0 && (
          <div className="col-span-full px-4 py-4">No pipelines found.</div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-4 my-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className={`px-3 py-1 rounded transition-all duration-200 ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
            }`}
          >
            Prev
          </button>
          <span className="text-sm text-gray-700">
            Page {page} of {pageCount}
          </span>
          <button
            disabled={page === pageCount}
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            className={`px-3 py-1 rounded transition-all duration-200 ${
              page === pageCount
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

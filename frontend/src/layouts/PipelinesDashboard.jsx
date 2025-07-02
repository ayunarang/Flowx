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
  const pageSize = 8; 
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
    }
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
      <h3 className="text-xl text-canvas-ink font-bold mb-3">
        Your Pipelines
      </h3>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-fit sm:w-auto flex gap-2 items-center font-medium"
          onClick={() => navigate("/")}
        >
          <span>New Pipeline </span>
          <PlusIcon height={16} width={16} className="font-medium" />
        </button>

        <input
          type="text"
          placeholder="Search pipelines..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 w-fit sm:w-64"
        />
      </div>

      <div className="border rounded overflow-hidden">
        <div className="hidden sm:grid grid-cols-[repeat(3,1fr)_0.5fr] gap-x-6 bg-gray-100 px-4 py-2 font-medium">
          <div>Pipeline Name</div>
          <div>Created At</div>
          <div className="col-span-2">Actions</div>
        </div>

        {paginatedPipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="grid grid-cols-1 sm:grid-cols-[repeat(3,1fr)_0.5fr] gap-x-6 px-4 py-3 border-t gap-y-2"
          >
            <div>
              <span className="font-semibold sm:hidden">Pipeline Name: </span>
              {pipeline.name}
            </div>
            <div>
              <span className="font-semibold sm:hidden">Created At: </span>
              {new Date(pipeline.created_at).toLocaleString()}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => navigate(`/pipeline/${pipeline.id}`)}
                className="text-blue-600 hover:underline flex items-center"
              >
                <Pencil className="w-4 h-4 mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(pipeline.id)}
                className="text-red-600 hover:underline flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}

        {paginatedPipelines.length === 0 && (
          <div className="px-4 py-4">No pipelines found.</div>
        )}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className={`px-3 py-1 rounded ${
              page === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Prev
          </button>
          <span>
            Page {page} of {pageCount}
          </span>
          <button
            disabled={page === pageCount}
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            className={`px-3 py-1 rounded ${
              page === pageCount
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

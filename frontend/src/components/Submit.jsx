
import { toast } from "sonner";
import { useStore } from "../store";
import { supabase } from "../supabaseClient";

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);


  const submitData = async () => {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    console.log("Supabase UID:", supabaseUser?.id);

    if (!supabaseUser) {
      alert("Please sign in to save your pipeline.");
      return;
    }

    try {
      const { error } = await supabase.from('pipelines').insert({
        owner_id: supabaseUser.id, 
        name: "My Pipeline",
        data: { nodes, edges },
        access_level: "public",
      });

      if (error) {
        console.error(error);
        toast.error("Failed to save pipeline.");
      } else {
        toast.success("Pipeline saved successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center align-middle">
      <button
        type="button"
        onClick={submitData}
        className="bg-[#1e1e28] text-white text-base font-medium px-3 py-2 rounded-md w-full shadow-subtle active:bg-[#292933] z-10"
      >
        Save
      </button>
    </div>
  );
};

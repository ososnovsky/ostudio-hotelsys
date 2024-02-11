import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditGuest } from "../../services/apiGuests";
import toast from "react-hot-toast";

export function useEditGuest() {
  const queryClient = useQueryClient();

  const { mutate: editGuest, isLoading: isEditing } = useMutation({
    mutationFn: ({ newGuestData, id }) => createEditGuest(newGuestData, id),
    onSuccess: () => {
      toast.success("Guest successfully edited");
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { editGuest, isEditing };
}

import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";

export async function getGuests({ sortBy, page }) {
  // const { data, error, count } = await supabase
  //   .from("guests")
  //   .select("*", { count: "exact" });

  let query = supabase.from("guests").select("*", { count: "exact" });

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  // PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Guests could not be loaded");
  }

  return { data, count };
}

export async function createEditGuest(newGuest, id) {
  console.log(newGuest, id);

  let query = supabase.from("guests");

  //Create
  if (!id) query = query.insert([newGuest]);

  // Edit
  if (id) query = query.update(newGuest).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Guest could not be created");
  }

  return data;
}

export async function deleteGuest(id) {
  const { data, error } = await supabase.from("guests").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be deleted");
  }

  return data;
}

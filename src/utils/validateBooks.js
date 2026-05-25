export function validateBook(data) {
  if (!data.title) return "Title is required";
  if (!data.author) return "Author is required";
  return null;
}

import prisma from "../db.server";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const productId = formData.get("productId");
  const title = formData.get("title");
  const handle = formData.get("handle");
  const image = formData.get("image");
  const price = parseFloat(formData.get("price") || "0");

  await prisma.wishlistItem.create({
    data: { productId, title, handle, image, price },
  });

  return Response.json({ success: true });
};
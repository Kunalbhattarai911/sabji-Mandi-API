import expressAsyncHandler from "express-async-handler";
import Prisma from "../../database/dbConfig.js";

export const buyVegetable = expressAsyncHandler(async (req, res, next) => {
  const { userId, storageId, location, vegetableId, quantityKg } = req.body;

  // Find storage by ID or location
  const findStorage = await Prisma.storage.findFirst({
    where: {
      OR: [{ id: String(storageId) }, { location }],
    },
    include: {
      Vegetables: true,
    },
  });

  if (!findStorage) {
    return res.status(404).json({
      success: false,
      message: "Storage Not Found",
    });
  }

  // Check if the vegetable exists in the selected storage
  const selectedVegetable = findStorage.Vegetables.find(
    (veg) => veg.id === vegetableId
  );

  if (!selectedVegetable) {
    return res.status(400).json({
      success: false,
      message: "Vegetable not available in this storage",
    });
  }

  // Check if there is enough quantity
  if (selectedVegetable.quantityKg < quantityKg) {
    return res.status(400).json({
      success: false,
      message: "Not enough quantity available",
    });
  }

  // Calculate total price
  const totalPrice = selectedVegetable.pricePerKg * quantityKg;

  // Reduce vegetable quantity
  await Prisma.vegetable.update({
    where: { id: vegetableId },
    data: { quantityKg: selectedVegetable.quantityKg - quantityKg },
  });

  // Reduce storage remaining capacity
  await Prisma.storage.update({
    where: { id: findStorage.id },
    data: { remainingCapacityKg: findStorage.remainingCapacityKg - quantityKg },
  });

  // Create purchase record
  const purchase = await Prisma.purchase.create({
    data: {
      userId,
      storageId: findStorage.id,
      vegetableId,
      quantityKg,
      totalPrice,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Purchase Successful",
    data: purchase,
  });
});

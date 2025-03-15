import expressAsyncHandler from "express-async-handler";
import Prisma from "../../database/dbConfig.js";

export const addVegetable = expressAsyncHandler(async (req, res, next) => {
  const storageId = String(req.params.storageId);
  const { name, quantityKg, pricePerKg } = req.body;

  //check if vegetable already exists or not
  const findVegetable = await Prisma.vegetable.findFirst({
    where: {
      name: name.toLowerCase(),
    },
  });

  if (findVegetable) {
    return res.status(400).json({
      success: false,
      message: "Vegetable already exists",
    });
  }

  //   check the storage capacity
  const checkStorageCapacity = await Prisma.storage.findUnique({
    where: {
      id: storageId,
    },
    select: {
      capacityKg: true,
      remainingCapacityKg: true,
    },
  });

  if (!checkStorageCapacity) {
    return res.status(404).json({
      success: false,
      message: "Storage not found",
    });
  }

  //check if storage has enough capacity or not
  if (
    checkStorageCapacity.remainingCapacityKg + quantityKg >
    checkStorageCapacity.capacityKg
  ) {
    return res.status(400).json({
      success: false,
      message: "Storage has not enough capacity.",
    });
  }

  //create new vegetable data
  const addVegetableData = await Prisma.vegetable.create({
    data: {
      name: name.toLowerCase(),
      quantityKg: quantityKg,
      pricePerKg: pricePerKg,
      storageId: storageId,
    },
  });

  //increase the storage vegetable count
  await Prisma.storage.update({
    where: {
      id: storageId,
    },
    data: {
      vegetableCount: {
        increment: 1,
      },
      remainingCapacityKg: {
        increment: quantityKg,
      },
    },
  });

  return res.status(201).json({
    success: true,
    message: "New vegetable data added success",
    data: addVegetableData,
  });
});

//get all vegetable data of that storage and pagination and limit
export const getAllVegetableOfStorage = expressAsyncHandler(
  async (req, res, next) => {
    const storageId = req.params.storageId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page <= 0) {
      page = 1;
    }

    if (limit <= 0 || limit >= 100) {
      limit = 10;
    }

    const skip = (page - 1) * limit;

    const findStorage = await Prisma.vegetable.findMany({
      skip: skip,
      take: limit,
      where: {
        storageId: String(storageId),
      },
    });

    if (!findStorage) {
      return res.status(404).json({
        success: false,
        message: "Storage Not Found.",
      });
    }

    //total count
    const totalPost = await Prisma.vegetable.count({
      where: {
        storageId: String(storageId),
      },
    });

    const totalPages = Math.ceil(totalPost / limit);

    return res.status(200).json({
      success: true,
      message: "All vegetable retrieve success",
      data: findStorage,
      meta: {
        totalPages,
        currentPage: page,
        limit: limit,
      },
    });
  }
);

//get single vegetable of that storage
export const getSingleVegetableOfStorage = expressAsyncHandler(
  async (req, res, next) => {
    const storageId = String(req.params.storageId);
    const vegetableId = String(req.params.vegetableId);

    const findVegetable = await Prisma.vegetable.findUnique({
      where: {
        storageId: storageId,
        id: vegetableId,
      },
    });

    if (!findVegetable) {
      return res.status(404).json({
        success: false,
        message: "vegetable not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vegetable retrieve success",
      data: findVegetable,
    });
  }
);

//delete vegetable
export const deleteVegetable = expressAsyncHandler(async (req, res, next) => {
  const storageId = String(req.params.storageId);
  const vegetableId = String(req.params.vegetableId);

  const findVegetable = await Prisma.vegetable.findUnique({
    where: {
      id: vegetableId,
      storageId: storageId,
    },
  });

  if (!findVegetable) {
    return res.status(404).json({
      success: false,
      message: "Vegetable not found",
    });
  }

  //delete the vegetable
  const deleteVegetableData = await Prisma.vegetable.delete({
    where: {
      id: vegetableId,
      storageId: storageId,
    },
  });

  //decrease the storage vegetable count
  await Prisma.storage.update({
    where: {
      id: storageId,
    },
    data: {
      vegetableCount: {
        decrement: 1,
      },
      remainingCapacityKg: {
        decrement: findVegetable.quantityKg,
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Vegetable deleted successfully.",
    data: deleteVegetableData,
  });
});

//search vegetable
export const searchVegetable = expressAsyncHandler(async (req, res, next) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Please provide a query",
    });
  }
  const vegetable = await Prisma.vegetable.findMany({
    where: {
      name: {
        search: query,
        // contains: query,
        // mode: "insensitive",
      },
    },
    include: {
      storage: {
        select: {
          id: true,
          location: true,
          remainingCapacityKg: true,
        },
      },
    },
  });

  if (vegetable.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No vegetable found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Search Successfull",
    data: vegetable,
  });
});

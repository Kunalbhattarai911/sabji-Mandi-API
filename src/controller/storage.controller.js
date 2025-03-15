import expressAsyncHandler from "express-async-handler";
import Prisma from "../../database/dbConfig.js";

//create new storage
export const createStorage = expressAsyncHandler(async (req, res, next) => {
  const { location, capacityKg } = req.body;

  const locationExists = await Prisma.storage.findFirst({
    where: {
      location: location,
    },
  });

  if (locationExists) {
    return res.status(400).json({
      success: false,
      message: "Location already exists",
    });
  }

  const newStorage = await Prisma.storage.create({
    data: {
      location,
      capacityKg,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Storage created success",
    data: newStorage,
  });
});

//get all storage
export const getAllStorage = expressAsyncHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page <= 0) {
    page = 1;
  }

  if (limit <= 0 || limit >= 100) {
    limit = 10;
  }

  const skip = (page - 1) * limit;
  const storage = await Prisma.storage.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      id: "asc",
    },
  });

  const totalPost = await Prisma.storage.count();
  const totalPage = Math.ceil(totalPost / limit);

  return res.status(200).json({
    success: true,
    message: "All Storage Retrieve Success.",
    data: storage,
    meta: {
      totalPage,
      currentPage: page,
      limit: limit,
    },
  });
});

//get storage by id
export const getStorageById = expressAsyncHandler(async (req, res, next) => {
  const storageId = String(req.params.id);

  const storage = await Prisma.storage.findUnique({
    where: {
      id: storageId,
    },
  });

  if (!storage) {
    return res.status(404).json({
      success: false,
      message: "Storage not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Storage Retrieve Success.",
    data: storage,
  });
});

//get all vegetable of a storage
export const getAllVegetableOfStorage = expressAsyncHandler(
  async (req, res, next) => {
    const storageId = String(req.params.id);

    const getVegetable = await Prisma.vegetable.findMany({
      where: {
        storageId: storageId,
      },
    });

    if (!getVegetable) {
      return res.status(404).json({
        success: false,
        message: "Not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "All Vegetable Retrieve Success",
      data: getVegetable,
    });
  }
);

//update storage
export const updateStorage = expressAsyncHandler(async (req, res, next) => {
  const storageId = String(req.params.id);
  const { location, capacityKg } = req.body;

  const existingStorage = await Prisma.storage.findUnique({
    where: {
      id: storageId,
    },
  });

  if (!existingStorage) {
    return res.status(404).json({
      success: false,
      message: "Storage not found",
    });
  }

  //check if new location already exists excluding the current location
  if (location && location !== existingStorage.location) {
    const existingLocationExists = await Prisma.storage.findFirst({
      where: {
        location: location,
      },
    });

    if (existingLocationExists) {
      return res.status(400).json({
        success: false,
        message: "Location Already Exists",
      });
    }
  }

  const updateStorageData = await Prisma.storage.update({
    where: {
      id: storageId,
    },
    data: {
      location: location || undefined,
      capacityKg: capacityKg || undefined,
    },
  });

  return res.status(201).json({
    success: true,
    message: "Storage updated success.",
    data: updateStorageData,
  });
});

//delete storage
export const deleteStorage = expressAsyncHandler(async (req, res, next) => {
  const storageId = String(req.params.id);

  const findStorage = await Prisma.storage.findUnique({
    where: {
      id: storageId,
    },
  });

  if (!findStorage) {
    return res.status(404).json({
      success: false,
      message: "Storage Not found",
    });
  }

  const deleteStorageData = await Prisma.storage.delete({
    where: {
      id: storageId,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Storage Deleted Success",
    data: deleteStorageData,
  });
});

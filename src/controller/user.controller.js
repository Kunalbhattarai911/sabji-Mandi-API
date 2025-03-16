import expressAsyncHandler from "express-async-handler";
import Prisma from "../../database/dbConfig.js";

export const createUser = expressAsyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  //find email
  const existingEmail = await Prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingEmail) {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  const newUser = await Prisma.user.create({
    data: {
      name,
      email,
    },
  });

  return res.status(201).json({
    success: true,
    message: "User Created success",
    data: newUser,
  });
});

//see buy data of a user
export const getBuyData = expressAsyncHandler(async (req, res, next) => {
  const userId = String(req.params.id);

  //find user
  const user = await Prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  //get data of user along with buy product
  const getBuyData = await Prisma.user.findFirst({
    where: {
      id: userId,
    },
    include: {
      Purchases: true,
    },
  });

  //total count of purchase
  const totalCount = await Prisma.purchase.count({
    where : {
      userId : userId
    }
  })

  //total amount of purchase
  const total = getBuyData.Purchases.map((item, i) => {
    return item.totalPrice;
  }).reduce((pre, cur) => {
    return pre + cur;
  }, 0);

  return res.status(200).json({
    success: true,
    message: "Data retrieve success",
    data: getBuyData,
    userMetaData: {
      totalExpense: total,
      totalCount : totalCount
    },
  });
});

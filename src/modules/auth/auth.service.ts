import { prisma } from "../../lib/prisma";


type IUser={
  name: string;
  email: string;
  password: string;
  profileImg: string;
  phone: string;
  address: string;
  age: number;
//   status: "ACTIVE" | "INACTIVE"  ;
  isVerified: boolean;
}

const createUserIntoDB = async (payload: IUser, hasPassword:string) => {
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password:hasPassword,
      phone: payload.phone,
      address: payload.address,
      age: payload.age,
    //   status: payload.status,
      isVerified: payload.isVerified,
    },
    select: {
      id: true,
      name: true,
      email: true,
      profileImg: true,
      phone: true,
      address: true,
      age: true,
      role: true,
      status: true,
    },
  });

  return user;
};

const authService = {
  createUserIntoDB,
};

export default authService;

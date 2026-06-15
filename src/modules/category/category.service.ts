import { prisma } from "../../lib/prisma";


// create new category 
const createCategoryIntoDB=async(payload:{
    title:string,
    description:string,
    thumbnail:string
})=>{
 
    const category =   await prisma.category.create({
    data: {
      title:payload.title,
      description:payload.description,
      thumbnail:payload.thumbnail,
    },

  });
  return category;
}


// get all category from DB

const getCategoryFromBD=async()=>{
    const category = await prisma.category.findMany()

    return category;
}

// update category from DB

const updateCategoryFromDB=async(payload:string)=>{
  const category=  await prisma.category.findUnique({
    where: {
      id: payload as string,
    },
  });
  return category;
}


// delete category from DB

const deleteCategory=async(payload:string)=>{
      await prisma.category.delete({
    where: {
      id: payload as string,
    },
  });
}


const categoryService= {
    createCategoryIntoDB,getCategoryFromBD,updateCategoryFromDB,
    deleteCategory
}

export default categoryService;
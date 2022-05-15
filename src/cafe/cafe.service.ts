import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/users.entity';
import { BeforeInsert, ILike, Like, Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { CafeInput, CafeOutput } from './dtos/cafe.dto';
import { CafesInput, CafesOutput } from './dtos/cafes.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateCafeInput, CreateCafeOutput } from './dtos/createCafe.dto';
import { CreateDishInput } from './dtos/createDish.dto';
import { DeleteCafeInput, DeleteCafeOutput } from './dtos/deleteCafe.dto';
import { DeleteDishInput } from './dtos/deleteDish.dto';
import { EditCafeInput, EditCafeOutput } from './dtos/editCafe.dto';
import { EditDishInput, EditDishOutput } from './dtos/editDish.dto';
import { SearchCafeInput, SearchCafeOutput } from './dtos/searchCafe.dto';
import { Cafe } from './entities/cafe.entity';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class CafeService {
  constructor(
    @InjectRepository(Cafe)
    private readonly cafes: Repository<Cafe>,
    private readonly categories: CategoryRepository,
    @InjectRepository(Dish)
    private readonly dishes: Repository<Dish>,
  ) {}
  getAll(): Promise<Cafe[]> {
    return this.cafes.find({relations:["category", "owner"]});
  }

  getOne(id):Promise<Cafe> {
    return this.cafes.findOne({where:{id:id},relations:["category", "owner","orders","menu"]});//relations:["category", "owner"]
  }
  async createCafe(
    owner: UserEntity,
    createCafeInput: CreateCafeInput,
  ): Promise<CreateCafeOutput> {
    try {
      const newCafe = this.cafes.create(createCafeInput);
      newCafe.owner = owner;
      const category = await this.categories.getOrCreate(
        createCafeInput.categoryName,
      );
      newCafe.category = category;
      await this.cafes.save(newCafe);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'could not create',
      };
    }
  }
  async editRestaurant(
    owner: UserEntity,
    editCafeInput: EditCafeInput,
  ): Promise<EditCafeOutput> {
    try {
      const cafe = await this.cafes.findOne({
        where: { id: editCafeInput.cafeId },
        loadRelationIds: true,
      });
      if (!cafe) {
        return {
          ok: false,
          error: 'Cafe not found',
        };
      }
      if (owner.id !== cafe.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }
      let category: Category = null;
      if (editCafeInput.categoryName) {
        category = await this.categories.getOrCreate(
          editCafeInput.categoryName,
        );
      }
      await this.cafes.save([
        {
          id: editCafeInput.cafeId,
          ...editCafeInput,
          ...(category && { category }),
        },
      ]);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not edit cafe',
      };
    }
  }
  async deleteCafe(
    owner: UserEntity,
    deleteCafeInput: DeleteCafeInput,
  ): Promise<DeleteCafeOutput> {
    try {
      const cafe = await this.cafes.findOne({
        where: { id: deleteCafeInput.cafeId },
        loadRelationIds: true,
      });
      if (!cafe) {
        return {
          ok: false,
          error: 'Cafe not found',
        };
      }
      if (owner.id !== cafe.ownerId) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.cafes.delete(deleteCafeInput.cafeId);
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete cafe',
      };
    }
  }


  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find({relations:["cafes"]});
      console.log("확인 categories : ",categories)

      return {
        ok: true,
        error: null,
        categories,
      };
    } catch (error) {
      return { ok: false, error: 'Could not load categories' };
    }
  }
  countCafe(category: Category) {
    return this.cafes.count({ category });
  }
  async findCategoryBySlug({ slug, page }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({
         where: { slug: slug },relations:['cafes']
        });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
          category,
        };
      }
      const cafes = await this.cafes.find({
        where:{category,
        },
        skip:(page-1)*2,
        take:2,
      })
      category.cafes=cafes
      // const totalResults = await this.countCafe(category)
      return {
        ok: true,
        cafeCount:await this.countCafe(category),
        category,

      };
    } catch (error) {
      return { ok: false, error: 'Could not load category' };
    }
  }
  async allCafes(
    {page}:CafesInput,
  ):Promise<CafesOutput>{
    try {
      const [cafes, totalResults] = await this.cafes.findAndCount({skip:(page-1)*2,take:2})
      return{
        ok: true,
        cafes,
        totalPages: Math.ceil(totalResults / 2),
        totalResults
      }
    } catch (error) {
      return{
        ok:false,
        error:'Could not load cafes'
      }
    }
  }
  async findCafeById({cafeId}:CafeInput,):Promise<CafeOutput>{
    console.log("cafeId : ", cafeId)
    try {
      const cafe = await this.cafes.findOne(cafeId,{relations:['menu']})
      console.log("cafe : ", cafe)
      if(!cafe){
        return{
          ok:false,
          error:'Cafe not found'
        }
      }
      return{
        ok:true,
        cafe,
      }
    } catch (error) {
      return{
        ok:false,
        error:'Could not find cafe'
      }
    }
  }
  async searchCafeByName({
    query,page
  }:SearchCafeInput): Promise<SearchCafeOutput>{
    try {
      const [cafes, totalResults] = await this.cafes.findAndCount(
        {where:{
          name:ILike(`%${query}%`)
        }}
      )
      return{
        ok:true,
        cafes,
        totalResults,
        totalPages: Math.ceil(totalResults / 2),
      }
    } catch (error) {
      return{
        ok:false,
        error:'Could not search for cafes'
      }
    }
  }
  async createDish(owner:UserEntity, createDishInput:CreateDishInput):Promise<CreateCafeOutput>{
    try {
      const cafe = await this.cafes.findOne(createDishInput.cafeId)
      if (!cafe){
        return {
          ok:false,
          error:'Cafe not found'
        }
      }
      if (owner.id!==cafe.ownerId){
        return {
          ok:false,
          error:"You can't do that."
        }
      }
      await this.dishes.save(this.dishes.create({...createDishInput, cafe}))//{...createDishInput, cafe})
      return{ok:true}
    } catch (error) {
      console.log(error)
      return{
        ok:false,
        error:'Could not create dish'
      }
    }
  }
  async editDish(owner:UserEntity, editDishInput:EditDishInput):Promise<EditDishOutput>{
    console.log("오너가 누구야 : ",owner)
    console.log("인풋이 뭐야 : ",editDishInput)

    try {
      const dish = await this.dishes.findOne({
        where: { id: editDishInput.dishId },
        relations:['cafe']
      });
      console.log("dish 누구냐? : ",dish)

    
      if(!dish){
        return{
          ok:false,
          error:"Dish not found"
        }
      }
      if (dish.cafe.ownerId!==owner.id){
        return {
          ok:false,
          error:"You can't do that."
        }
      }
      await this.dishes.save([
        {
          id:editDishInput.dishId,
          ...editDishInput,
        }
      ])
      return({ok:true})
    } catch (error) {
      return{
        ok:false,
        error:"Could not delete dish"
      }
    }
  }


  async deleteDish(owner:UserEntity, {dishId}:DeleteDishInput):Promise<DeleteCafeOutput>{
    try {
      const dish = await this.dishes.findOne({
        where: { id: dishId },
        relations:['cafe']
      });
      if(!dish){
        return{
          ok:false,
          error:"Dish not found"
        }
      }
      if (dish.cafe.ownerId!==owner.id){
        return {
          ok:false,
          error:"You can't do that."
        }
      }
      await this.dishes.delete(dishId)
      return({ok:true})
    } catch (error) {
      console.log(error)
      return{
        ok:false,
        error:"Could not delete dish"
      }
    }
  }
}

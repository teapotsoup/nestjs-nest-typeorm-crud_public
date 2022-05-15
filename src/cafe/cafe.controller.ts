import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { AuthUser } from 'src/auth/authUser.decorator';
import { Role } from 'src/auth/role.decorator';
import { CreateAccountOutput } from 'src/users/dtos/createUser.dto';
import { UserEntity } from 'src/users/entities/users.entity';
import { CafeService } from './cafe.service';
import { AllCategoriesOutput } from './dtos/allCategories.dto';
import { CafeInput, CafeOutput } from './dtos/cafe.dto';
import { CafesInput, CafesOutput } from './dtos/cafes.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateCafeInput } from './dtos/createCafe.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/createDish.dto';
import { DeleteCafeInput, DeleteCafeOutput } from './dtos/deleteCafe.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/deleteDish.dto';
import { EditCafeInput, EditCafeOutput } from './dtos/editCafe.dto';
import { EditDishInput, EditDishOutput } from './dtos/editDish.dto';
import { SearchCafeInput, SearchCafeOutput } from './dtos/searchCafe.dto';
import { Cafe } from './entities/cafe.entity';

@Controller('cafe') // 여기 라우터에서 헤더안 토큰으로부터 사용자 정보를 가져오지 못한다
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}
  @Get('allCafe')
  async getAllUsers(): Promise<Cafe[]> {
    const result = await this.cafeService.getAll();
    return result;
  }

  @Post('OneCafe')
  async getOneUsers(@Body() body): Promise<Cafe> {
    const result = await this.cafeService.getOne(body.id);
    return result;
  }

  @Post()
  @Role(['Owner'])
  async createCafe(
    @AuthUser() authUser: UserEntity, //여기서 막힘. request에 유저가 없다
    @Body() createCafeInput: CreateCafeInput,
  ): Promise<CreateAccountOutput> {
    return this.cafeService.createCafe(authUser, createCafeInput);
  }
  @Post('edit')
  @Role(['Owner'])
  async editCafe(
    @AuthUser() owner: UserEntity,
    @Body() editCafeInput: EditCafeInput,
  ): Promise<EditCafeOutput> {
    console.log('카페 수정 포스트 진입');
    console.log('editCafeInput : ', editCafeInput);
    return await this.cafeService.editRestaurant(owner, editCafeInput);
  }

  @Delete()
  @Role(['Owner'])
  async deleteCafe(
    @AuthUser() owner: UserEntity,
    @Body() deleteCafeInput: DeleteCafeInput,
  ): Promise<DeleteCafeOutput> {
    return await this.cafeService.deleteCafe(owner, deleteCafeInput);
  }

  @Post('findOneCafe')
  async findOneCafe(@Body() cafeInput: CafeInput): Promise<CafeOutput> {
    console.log('findOneCafe 포스트 진입');
    console.log('cafeInput : ', cafeInput);
    return await this.cafeService.findCafeById(cafeInput);
  }

  @Post('SearchCafe')
  searchCafe(
    @Body() searchCafeInput: SearchCafeInput,
  ): Promise<SearchCafeOutput> {
    return this.cafeService.searchCafeByName(searchCafeInput);
  }

  //#10.12~13 리졸브 필드..어떻게 만드나
  // @ResolveField(type=>Int)
  // cafeCount(@Parent() category:Category ):Promise<number>{
  //   return this.cafeService.countCafe(category)
  // }

  //*---카테고리---*

  @Get('allCategories')
  async allCategories(): Promise<AllCategoriesOutput> {
    return await this.cafeService.allCategories();
  }
  @Post('slug')
  async category(
    @Body() categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return await this.cafeService.findCategoryBySlug(categoryInput);
  }

  @Post('cafes') //파지네이션한 카페리스트 보여준다
  async cafes(@Body() cafesInput: CafesInput): Promise<CafesOutput> {
    return await this.cafeService.allCafes(cafesInput);
  }

  //*---카테고리 end---*

  //*---Dish---*
  @Post('createDish')
  @Role(['Owner'])
  createDish(
    @AuthUser() owner: UserEntity,
    @Body() createDishInput: CreateDishInput,
  ):Promise<CreateDishOutput> {
    return this.cafeService.createDish(owner, createDishInput)
  }

  @Post('editDish')
  @Role(['Owner'])
  editDish(
    @AuthUser() owner: UserEntity,
    @Body() editDishInput: EditDishInput,
  ):Promise<EditDishOutput> {
    console.log("Edit Dish 진입")
    return this.cafeService.editDish(owner, editDishInput)
  }


  // @Delete()
  // @Role(['Owner'])
  // async deleteCafe(
  //   @AuthUser() owner: UserEntity,
  //   @Body() deleteCafeInput: DeleteCafeInput,
  // ): Promise<DeleteCafeOutput> {
  //   return await this.cafeService.deleteCafe(owner, deleteCafeInput);
  // }

  @Delete("deleteDish")
  @Role(['Owner'])
  deleteDish(
    @AuthUser() owner: UserEntity,
    @Body() deleteDishInput: DeleteDishInput,
  ):Promise<DeleteDishOutput> {
    return this.cafeService.deleteDish(owner, deleteDishInput)
  }
}

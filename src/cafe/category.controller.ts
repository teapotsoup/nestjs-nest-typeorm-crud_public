import { Body, Controller, Get, Post } from "@nestjs/common";
import { CafeService } from "./cafe.service";
import { AllCategoriesOutput } from "./dtos/allCategories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";

@Controller('category') // 여기 라우터에서 헤더안 토큰으로부터 사용자 정보를 가져오지 못한다
export class CategoryController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('allCategories')
  async allCategories():Promise<AllCategoriesOutput>{
    return await this.cafeService.allCategories()
  }
  @Post('slug')
  async category(@Body() categoryInput:CategoryInput):Promise<CategoryOutput>{
      return this.cafeService.findCategoryBySlug(categoryInput)
  }
}
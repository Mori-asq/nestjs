import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/jwt-auth/jwt-auth.guard';
import UserGuard from 'src/users/dto/userGuards';
import { I18n, I18nContext } from 'nestjs-i18n';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductForBiddenRespnonse } from './dto/forbidden.dto';

@Controller('products')
@ApiTags('products')
@ApiBearerAuth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: ProductForBiddenRespnonse,
  })
  @ApiResponse({ status: 201, description: 'Created', type: CreateProductDto })
  @ApiHeader({
    name: 'Lang',
    description: 'send preferred language',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the product',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  create(@Body() createProductDto: CreateProductDto, @Request() request) {
    const user: UserGuard = request.user;
    createProductDto.user = user;
    return this.productsService.create(createProductDto);
  }

  @Get()
  @HttpCode(200)
  findAll(@I18n() i18n: I18nContext) {
    // return { message: i18n.t('tr.hello') };
    return this.productsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() request,
  ) {
    updateProductDto.user = request.user;
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string, @Request() request) {
    return this.productsService.remove(+id, request.user);
  }
}

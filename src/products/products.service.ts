import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Products from 'src/entities/products.entity';
import { Repository } from 'typeorm';
import UserGuard from 'src/users/dto/userGuards';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly products_repository: Repository<Products>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const newProduct = await this.products_repository.save(createProductDto);
    return newProduct;
  }

  async findAll() {
    return await this.products_repository.find();
  }

  async findOne(id: number) {
    const product = await this.products_repository.findOne({
      where: {
        id,
      },
    });

    if (!product) throw new HttpException(`PRODUCT NOT FOUND!`, 404);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const check = await this.products_repository.update(
      { id, user: updateProductDto.user },
      { ...updateProductDto },
    );

    if (check.affected === 0) {
      throw new HttpException(`PRODUCT NOT FOUND!`, 404);
    }

    return { message: `PRODUCT ${id} UPDATED SUCCESSFULLY!` };
  }

  async remove(id: number, user: UserGuard) {
    const product = await this.products_repository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.user', 'users')
      .where('products.id = :id', { id })
      .andWhere('products.user = :user', { user: user.id })
      .getOne();

    if (!product) throw new HttpException(`PRODUCT NOT FOUND!`, 404);

    await this.products_repository.remove(product);
    return { message: `PRODUCT ${id} DELETED SUCCESSFULLY!` };
  }
}

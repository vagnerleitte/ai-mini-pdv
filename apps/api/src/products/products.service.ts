import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const data = {
      name: createProductDto.name,
      sku: createProductDto.sku,
      price: new Prisma.Decimal(createProductDto.price),
      quantity: createProductDto.quantity ?? 0
    };

    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Produto com este SKU já existe.');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.ensureExists(id);

    const data: Prisma.ProductUpdateInput = {};

    if (updateProductDto.name !== undefined) {
      data.name = updateProductDto.name;
    }

    if (updateProductDto.sku !== undefined) {
      data.sku = updateProductDto.sku;
    }

    if (updateProductDto.price !== undefined) {
      data.price = new Prisma.Decimal(updateProductDto.price);
    }

    if (updateProductDto.quantity !== undefined) {
      data.quantity = updateProductDto.quantity;
    }

    try {
      return await this.prisma.product.update({
        where: { id },
        data
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Produto com este SKU já existe.');
      }
      throw error;
    }
  }

  async remove(id: number) {
    await this.ensureExists(id);

    return this.prisma.product.delete({
      where: { id }
    });
  }

  async adjustStock(id: number, delta: number) {
    const product = await this.findOne(id);
    const newQuantity = product.quantity + delta;

    if (newQuantity < 0) {
      throw new BadRequestException('Estoque insuficiente');
    }

    return this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity }
    });
  }

  private async ensureExists(id: number) {
    const exists = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!exists) {
      throw new NotFoundException(`Produto ${id} não encontrado.`);
    }
  }
}

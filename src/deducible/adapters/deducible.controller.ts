import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { GetDeducibleUseCase } from '../application/getDeducible.usecase';
import { Deducible } from '../domain/entity/deducible.entity';

@Controller()
export class DeducibleController {
  constructor(private readonly getDeducibleUseCase: GetDeducibleUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async getDeducible(@Body() deducibleDto: { deducibleText: string }): Promise<Deducible> {
    try {
      const { deducibleText } = deducibleDto;
      return await this.getDeducibleUseCase.execute(deducibleText);
    } catch (error) {
      console.error('Error executing getDeducibleUseCase:', error);
      throw new InternalServerErrorException('An error occurred while processing your request.');
    }
  }
}

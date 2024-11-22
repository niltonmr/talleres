import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { GetDeducibleUseCase } from '../application/getDeducible.usecase';
import { Deducible } from '../domain/entity/deducible.entity';
import { GetDeducibleRequest } from '../dto/getDeducibleRequest.dto';

@Controller('deducible')
export class DeducibleController {
  constructor(private readonly getDeducibleUseCase: GetDeducibleUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async getDeducible(@Body() deducibleDto: GetDeducibleRequest): Promise<Array<Deducible>> {
    try {
      const {
        payload: { text }
      } = deducibleDto;
      return await this.getDeducibleUseCase.execute(text);
    } catch (error) {
      console.error('Error executing getDeducibleUseCase:', error);
      throw new InternalServerErrorException('An error occurred while processing your request.');
    }
  }
}

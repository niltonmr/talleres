import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { GetDeducibleUseCase } from '../application/getDeducible.usecase';
import { Deducible } from '../domain/entity/deducible.entity';
import { GetDeducibleRequest, GetDeducibleResponse } from '../dto/getDeducibleRequest.dto';

@Controller('deducible')
export class DeducibleController {
  constructor(private readonly getDeducibleUseCase: GetDeducibleUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async getDeducible(@Body() deducibleDto: GetDeducibleRequest): Promise<GetDeducibleResponse> {
    try {
      const {
        payload: { text }
      } = deducibleDto;
      const payload = await this.getDeducibleUseCase.execute(text);
      return { payload };
    } catch (error) {
      console.error('Error executing getDeducibleUseCase:', error);
      throw new InternalServerErrorException('An error occurred while processing your request.');
    }
  }
}

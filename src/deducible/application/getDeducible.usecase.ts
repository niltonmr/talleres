import { Injectable } from '@nestjs/common';
import { DeducibleDomainService } from '../domain/service/deducibleService';
import { Deducible } from '../domain/entity/deducible.entity';

@Injectable()
export class GetDeducibleUseCase {
  constructor(private readonly deducibleDomainService: DeducibleDomainService) {}

  async execute(deducibleText: string): Promise<Array<Deducible>> {
    // Business logic
    return await this.deducibleDomainService.getFromText(deducibleText);
  }
}

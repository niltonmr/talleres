import { Inject, Injectable } from '@nestjs/common';
import { DeducibleInterfaceRepository } from '../repository/deducible.repository';
import { Deducible } from '../entity/deducible.entity';

@Injectable()
export class DeducibleDomainService {
  private readonly deducibleRepository: DeducibleInterfaceRepository;

  constructor(@Inject('DeducibleInterfaceRepository') deducibleRepository: DeducibleInterfaceRepository) {
    this.deducibleRepository = deducibleRepository;
  }

  async getFromText(deducibleText: string): Promise<Deducible> {
    return this.deducibleRepository.getFromText(deducibleText);
  }
}

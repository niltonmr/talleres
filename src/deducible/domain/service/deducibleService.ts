import { Inject, Injectable } from '@nestjs/common';
import { DeducibleInterfaceRepository } from '../repository/deducible.repository';
import { Deducible } from '../entity/deducible.entity';

@Injectable()
export class DeducibleDomainService {
  private readonly deducibleRepository: DeducibleInterfaceRepository;

  constructor(@Inject('DeducibleInterfaceRepository') deducibleRepository: DeducibleInterfaceRepository) {
    this.deducibleRepository = deducibleRepository;
  }

  async getFromText(deducibleText: string): Promise<Array<Deducible>> {
    const deducibles = await Deducible.getFromText(deducibleText);
    await Promise.all(
      deducibles.map(async deducible => {
        delete deducible.esParaTalleres;
      })
    );
    return deducibles;
  }
}

import { Injectable } from '@nestjs/common';
import { DeducibleInterfaceRepository } from '../domain/repository/deducible.repository';
import { Deducible } from '../domain/entity/deducible.entity';

@Injectable()
export class DeducibleRepositoryImpl implements DeducibleInterfaceRepository {
  private readonly deducibles: Map<string, Deducible> = new Map();

  getFromText(deducibleText: string): Promise<Deducible> {
    let deducible = new Deducible();
    deducible.valor = true;

    return Promise.resolve(deducible);
  }
}

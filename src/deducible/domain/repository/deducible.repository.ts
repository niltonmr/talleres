import { Deducible } from '../entity/deducible.entity';

export interface DeducibleInterfaceRepository {
  getFromText(deducibleText: string): Promise<Deducible>;
}

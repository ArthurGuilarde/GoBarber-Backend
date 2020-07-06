import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload;
  }

  public async compareHash(payload: string, hased: string): Promise<boolean> {
    return payload === hased;
  }
}

export default FakeHashProvider;

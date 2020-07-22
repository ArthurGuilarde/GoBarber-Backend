import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderService from '@modules/appointments/services/ListProviderService';

export default class ProvidersController {
  /**
   * index
   */
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const providers = await container.resolve(ListProviderService).execute({
      user_id,
    });

    return response.json(providers);
  }
}

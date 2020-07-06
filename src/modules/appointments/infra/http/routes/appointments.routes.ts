import { Router } from 'express';
import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

const appoitmentsRoute = Router();
const appointmentsController = new AppointmentsController();

// appoitmentsRoute.get('/', async (req, resp) => {
//   resp.json(await appointmentsRepository.find());
// });

appoitmentsRoute.post('/', appointmentsController.create);

export default appoitmentsRoute;

import { Router } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta
// Condições a mais do que a acima provavelmente será preciso abstrair em um service
// SoC: Separation of Concerns
// Regra de negócio: Algo que está muito específico na aplicação

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

// aplicar este middleware em todas as rotas de agendamento
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointments = await appointmentsRepository.find();

//   return response.json(appointments);
// });

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  // transformação de dado
  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService(appointmentsRepository);

  const appointment = await createAppointment.execute({ date: parsedDate, provider_id });

  return response.json(appointment);
});

export default appointmentsRouter;

import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

// Controllers
import { pathNotFoundController } from '../controllers/PathNotFoundController';

import { couriersController } from '../controllers/CouriersController';
import { doctorsController } from '../controllers/DoctorsController';
import { drugstoresController } from '../controllers/DrugstoresController';
import { prescriptionsController } from '../controllers/PrescriptionsController';
import { prescriptionItemsController } from '../controllers/PrescriptionItemsController';
import { usersController } from '../controllers/UsersController';


// GraphQL Schema
import { openSchema, schema, root } from '../resolvers/root';

class MainRoutes {
  public router: express.Router = express.Router();

  constructor() {
    this.config();
  }

  private config(): void {

    // REST ROUTES - have to be first here as otherwise the Router will not process them

    /// COURIERS ///
    this.router.get('/api/v1/couriers', (req: express.Request, res: express.Response) => couriersController.list(req, res));
    this.router.get('/api/v1/couriers/:id', (req: express.Request, res: express.Response) => couriersController.get(req, res));
    this.router.post('/api/v1/couriers', (req: express.Request, res: express.Response) => couriersController.create(req, res));
    this.router.put('/api/v1/couriers/:id', (req: express.Request, res: express.Response) => couriersController.update(req, res));
    this.router.patch('/api/v1/couriers/:id', (req: express.Request, res: express.Response) => couriersController.patch(req, res));
    this.router.delete('/api/v1/couriers/:id', (req: express.Request, res: express.Response) => couriersController.delete(req, res));

    /// DOCTORS ///
    this.router.get('/api/v1/doctors', (req: express.Request, res: express.Response) => doctorsController.list(req, res));
    this.router.get('/api/v1/doctors/:id', (req: express.Request, res: express.Response) => doctorsController.get(req, res));
    this.router.post('/api/v1/doctors', (req: express.Request, res: express.Response) => doctorsController.create(req, res));
    this.router.put('/api/v1/doctors/:id', (req: express.Request, res: express.Response) => doctorsController.update(req, res));
    this.router.patch('/api/v1/doctors/:id', (req: express.Request, res: express.Response) => doctorsController.patch(req, res));
    this.router.delete('/api/v1/doctors/:id', (req: express.Request, res: express.Response) => doctorsController.delete(req, res));

    /// DRUGSTORES ///
    this.router.get('/api/v1/drugstores', (req: express.Request, res: express.Response) => drugstoresController.list(req, res));
    this.router.get('/api/v1/drugstores/:id', (req: express.Request, res: express.Response) => drugstoresController.get(req, res));
    this.router.post('/api/v1/drugstores', (req: express.Request, res: express.Response) => drugstoresController.create(req, res));
    this.router.put('/api/v1/drugstores/:id', (req: express.Request, res: express.Response) => drugstoresController.update(req, res));
    this.router.patch('/api/v1/drugstores/:id', (req: express.Request, res: express.Response) => drugstoresController.patch(req, res));
    this.router.delete('/api/v1/drugstores/:id', (req: express.Request, res: express.Response) => drugstoresController.delete(req, res));

    /// PRESCRIPTIONS ///
    this.router.get('/api/v1/prescriptions', (req: express.Request, res: express.Response) => prescriptionsController.list(req, res));
    this.router.get('/api/v1/prescriptions/:id', (req: express.Request, res: express.Response) => prescriptionsController.get(req, res));
    this.router.post('/api/v1/prescriptions', (req: express.Request, res: express.Response) => prescriptionsController.create(req, res));
    this.router.put('/api/v1/prescriptions/:id', (req: express.Request, res: express.Response) => prescriptionsController.update(req, res));
    this.router.patch('/api/v1/prescriptions/:id', (req: express.Request, res: express.Response) => prescriptionsController.patch(req, res));
    this.router.delete('/api/v1/prescriptions/:id', (req: express.Request, res: express.Response) => prescriptionsController.delete(req, res));

    /// PRESCRIPTIONITEMS ///
    this.router.get('/api/v1/prescriptions/:id/prescription-items', (req: express.Request, res: express.Response) => prescriptionItemsController.list(req, res));
    this.router.get('/api/v1/prescriptions/:id/prescription-items/:id', (req: express.Request, res: express.Response) => prescriptionItemsController.get(req, res));
    this.router.post('/api/v1/prescriptions/:id/prescription-items', (req: express.Request, res: express.Response) => prescriptionItemsController.create(req, res));
    this.router.put('/api/v1/prescriptions/:id/prescription-items/:id', (req: express.Request, res: express.Response) => prescriptionItemsController.update(req, res));
    this.router.patch('/api/v1/prescriptions/:id/prescription-items/:id', (req: express.Request, res: express.Response) => prescriptionItemsController.patch(req, res));
    this.router.delete('/api/v1/prescriptions/:id/prescription-items/:id', (req: express.Request, res: express.Response) => prescriptionItemsController.delete(req, res));

    /// USERS ///
    this.router.get('/api/v1/users', (req: express.Request, res: express.Response) => usersController.list(req, res));
    this.router.get('/api/v1/users/:id', (req: express.Request, res: express.Response) => usersController.get(req, res));
    this.router.post('/api/v1/users', (req: express.Request, res: express.Response) => usersController.create(req, res));
    this.router.put('/api/v1/users/:id', (req: express.Request, res: express.Response) => usersController.update(req, res));
    this.router.patch('/api/v1/users/:id', (req: express.Request, res: express.Response) => usersController.patch(req, res));
    this.router.delete('/api/v1/users/:id', (req: express.Request, res: express.Response) => usersController.delete(req, res));

    /// GRAPH QL ///

    // no authentication required
    this.router.use(
      '/api/open/graphql',
      graphqlHTTP({
        schema: openSchema,
        rootValue: root,
        graphiql: true
      })
    );

    // authentication required
    // this.router.use(
    //   '/api/protected/graphql',
    //   graphqlHTTP({
    //     schema,
    //     rootValue: root,
    //     graphiql: true
    //   })
    // );

    // This is where we define the OLD ROUTES
    this.router.use((req: express.Request, res: express.Response) => pathNotFoundController.root(req, res));
  }
}

export const mainRoutes = new MainRoutes().router;

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { ActiveEndpointHandler, InvalidEndpointHandler, MethodNotAllowedHandler } from './handlers/base-handler';
import { AccessVerification } from './middleware/access-verification';
import { AuthorizedHeaderVerification, GenericHeaderVerification } from './middleware/header-verification';
import errorMiddleware from './middleware/error-middleware';
import { AuthRouter } from './routers/auth';
import UserRouter from './routers/user';
import CanteenRouter from './routers/canteen';
import VendorRouter from './routers/vendor';
import DepartmentRouter from './routers/department';
import InstructorRouter from './routers/instructor';
import CourseRouter from './routers/course';
import ClassRouter from './routers/class';
import ImageRouter from './routers/image';

const app = express();
app.options('*', cors());
app.use(cors());
export default app;

// Base URL where all the logics are handled
const baseURL: string = '/api/v1';

/*
 * Express middlewares to handle the request
 */

// Body parser middleware

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Server URL middleware to check server status
app.route('/').get(ActiveEndpointHandler).all(MethodNotAllowedHandler);

// BASE URL and to verify if the request has access using the access key
app.use(AccessVerification, GenericHeaderVerification);
app.route(baseURL).get(ActiveEndpointHandler).all(MethodNotAllowedHandler);

app.use(`${baseURL}/auth`, AuthRouter);
app.use(`${baseURL}/user`, UserRouter);
app.use(`${baseURL}/canteen`, CanteenRouter);
app.use(`${baseURL}/vendor`, VendorRouter);
app.use(`${baseURL}/department`, DepartmentRouter);
app.use(`${baseURL}/instructor`, InstructorRouter);
app.use(`${baseURL}/course`, CourseRouter);
app.use(`${baseURL}/class`, ClassRouter);
app.use(`${baseURL}/image`, ImageRouter);

app.use(AuthorizedHeaderVerification);

/*
 * Importing all the individual routers
 */

/*
 * Handle Invalid Endpoints - return 404
 */

app.route('*').all(InvalidEndpointHandler);
app.use(errorMiddleware);

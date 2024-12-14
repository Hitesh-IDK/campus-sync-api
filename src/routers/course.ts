import express from 'express';
import { ActiveEndpointHandler, MethodNotAllowedHandler } from '../handlers/base-handler';
import { AuthorizedHeaderVerification } from '../middleware/header-verification';
import addCourseHandler, { AddCourseBodyValidator } from '../handlers/course/add-course-handler';

const CourseRouter = express.Router();
export default CourseRouter;

CourseRouter.get('/', ActiveEndpointHandler).all('/', MethodNotAllowedHandler);
// CourseRouter.use(AuthorizedHeaderVerification);

CourseRouter.post('/add', AddCourseBodyValidator, addCourseHandler).all('/add', MethodNotAllowedHandler);

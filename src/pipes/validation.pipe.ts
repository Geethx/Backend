import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) return value;
    const errors = await validate(Object.assign(new metatype(), value));
    if (errors.length > 0) throw new BadRequestException(errors);
    return value;
  }
}

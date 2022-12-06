import { ArgumentMetadata, HttpException, HttpStatus, Injectable, ValidationPipe } from "@nestjs/common";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

@Injectable()
export class BackendValidation extends ValidationPipe {

    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        const object = plainToClass(metadata.metatype, value)
        const errorsObject = await validate(object);

        if (errorsObject.length == 0) return value;

        throw new HttpException({ errors: this.formatError(errorsObject) }, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    formatError(errorsArray: ValidationError[]): any {
        return errorsArray.reduce((acc, curr) => {
            acc[curr.property] = Object.values(curr.constraints)
            return acc;
        }, {})
    }
}
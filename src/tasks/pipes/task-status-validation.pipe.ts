import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];
  transform(value: any) {
    value.toUpperCase();
    if (!this.statusIsValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }
    return value;
  }
  private statusIsValid(status: any): boolean {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
